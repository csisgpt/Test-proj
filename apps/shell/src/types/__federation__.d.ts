// apps/shell/src/types/__federation__.d.ts
declare module 'virtual:__federation__' {
  export interface IRemoteConfig {
    url: string | (() => Promise<string>)
    format?: 'esm' | 'systemjs' | 'var'
    from?: 'vite' | 'webpack'
  }
  export function __federation_method_setRemote(name: string, config: IRemoteConfig): void
  export function __federation_method_getRemote(name: string, exposedPath: string): Promise<unknown>
  export function __federation_method_unwrapDefault(mod: unknown): any
  export function __federation_method_ensure(name: string): Promise<unknown>
  export function __federation_method_wrapDefault(mod: unknown, need: boolean): Promise<unknown>
}
