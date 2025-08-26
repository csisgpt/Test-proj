import { validateEnv } from './schema'
let _cfg: ReturnType<typeof validateEnv> | null = null
export function getConfig() {
  if (!_cfg) _cfg = validateEnv(import.meta.env as any)
  return _cfg
}
