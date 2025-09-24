import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5173

// مسیرهای خروجی
const shellDist = path.resolve(__dirname, '../apps/shell/dist')
const pharmacyDist = path.resolve(__dirname, '../apps/pharmacy/dist')

// سرو شِل در روت (SPA)
app.use('/assets', express.static(path.join(shellDist, 'assets'), { fallthrough: false }))

// سرو Pharmacy فقط برای فایل‌های استاتیک (remoteEntry + chunks)
app.use('/pharmacy/assets', express.static(path.join(pharmacyDist, 'assets'), { fallthrough: false }))

// fallback: index.html شل برای همه‌ی مسیرهای دیگر
app.get('*', (req, res) => {
  res.sendFile(path.join(shellDist, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Unified preview running: http://localhost:${PORT}`)
  console.log(`Shell dist:     ${shellDist}`)
  console.log(`Pharmacy dist:  ${pharmacyDist}  (mounted at /pharmacy/assets)`)
})
