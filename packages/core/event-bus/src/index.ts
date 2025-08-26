import { EventEmitter } from 'events'
import { z } from 'zod'

// Define event schemas with Zod for type safety
export const EventSchemas = {
  USER_LOGIN: z.object({
    userId: z.string(),
    email: z.string().email(),
    timestamp: z.number(),
    sessionId: z.string()
  }),
  
  USER_LOGOUT: z.object({
    userId: z.string(),
    timestamp: z.number()
  }),
  
  DATA_UPDATE: z.object({
    entity: z.string(),
    id: z.string(),
    changes: z.record(z.unknown()),
    source: z.string(),
    timestamp: z.number()
  }),
  
  NAVIGATION: z.object({
    from: z.string(),
    to: z.string(),
    params: z.record(z.string()).optional(),
    query: z.record(z.string()).optional()
  }),
  
  APP_LOADED: z.object({
    appId: z.string(),
    version: z.string(),
    loadTime: z.number()
  }),
  
  ERROR_OCCURRED: z.object({
    appId: z.string(),
    error: z.string(),
    stack: z.string().optional(),
    timestamp: z.number()
  })
}

// Generate TypeScript types from schemas
export type EventMap = {
  [K in keyof typeof EventSchemas]: z.infer<typeof EventSchemas[K]>
}

export type EventName = keyof EventMap

class TypedEventBus extends EventEmitter {
  private static instance: TypedEventBus
  private messageQueue: Array<{
    event: string
    data: any
    timestamp: number
  }> = []
  
  private constructor() {
    super()
    this.setupGlobalListener()
  }
  
  static getInstance(): TypedEventBus {
    if (!TypedEventBus.instance) {
      TypedEventBus.instance = new TypedEventBus()
    }
    return TypedEventBus.instance
  }
  
  private setupGlobalListener() {
    window.addEventListener('message', (event) => {
      if (event.data?.type === 'MICRO_APP_EVENT') {
        const { event: eventName, data, source } = event.data
        
        // Don't process our own events
        if (source !== this.getCurrentAppId()) {
          this.handleRemoteEvent(eventName, data)
        }
      }
    })
  }
  
  private handleRemoteEvent(eventName: string, data: any) {
    // Validate and re-emit locally
    try {
      const schema = EventSchemas[eventName as EventName]
      if (schema) {
        const validated = schema.parse(data)
        super.emit(eventName, validated)
      }
    } catch (error) {
      console.error(`Invalid event data for ${eventName}:`, error)
    }
  }
  
  emit<K extends EventName>(event: K, data: EventMap[K]): boolean {
    // Validate data
    const schema = EventSchemas[event]
    const validated = schema.parse(data)
    
    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[EventBus] ${event}:`, validated)
    }
    
    // Queue for potential replay
    this.messageQueue.push({
      event,
      data: validated,
      timestamp: Date.now()
    })
    
    // Trim queue if too large
    if (this.messageQueue.length > 100) {
      this.messageQueue = this.messageQueue.slice(-50)
    }
    
    // Broadcast to other micro-apps
    window.postMessage({
      type: 'MICRO_APP_EVENT',
      event,
      data: validated,
      source: this.getCurrentAppId()
    }, '*')
    
    return super.emit(event, validated)
  }
  
  on<K extends EventName>(
    event: K,
    listener: (data: EventMap[K]) => void
  ): this {
    return super.on(event, listener)
  }
  
  once<K extends EventName>(
    event: K,
    listener: (data: EventMap[K]) => void
  ): this {
    return super.once(event, listener)
  }
  
  off<K extends EventName>(
    event: K,
    listener: (data: EventMap[K]) => void
  ): this {
    return super.off(event, listener)
  }
  
  // Request-Response pattern for inter-app communication
  async request<K extends EventName, R = any>(
    event: K,
    data: EventMap[K],
    timeout = 5000
  ): Promise<R> {
    const requestId = crypto.randomUUID()
    const responseEvent = `${event}:response:${requestId}` as const
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.off(responseEvent as any, responseHandler)
        reject(new Error(`Request timeout for ${event}`))
      }, timeout)
      
      const responseHandler = (response: R) => {
        clearTimeout(timer)
        resolve(response)
      }
      
      this.once(responseEvent as any, responseHandler)
      this.emit(event, {
        ...data,
        __requestId: requestId,
        __responseEvent: responseEvent
      } as any)
    })
  }
  
  private getCurrentAppId(): string {
    return (window as any).__MICRO_APP_ID__ || 'shell'
  }
  
  // Replay queued messages (useful after reconnection)
  replayQueue(filter?: (item: typeof this.messageQueue[0]) => boolean): void {
    const items = filter ? this.messageQueue.filter(filter) : this.messageQueue
    
    items.forEach(({ event, data }) => {
      super.emit(event, data)
    })
  }
  
  clearQueue(): void {
    this.messageQueue = []
  }
}

// Export singleton instance
export const eventBus = TypedEventBus.getInstance()

// Vue plugin
export const EventBusPlugin = {
  install(app: any) {
    app.config.globalProperties.$eventBus = eventBus
    app.provide('eventBus', eventBus)
  }
}
