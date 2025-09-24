export async function checkPharmacyRemote() {
  try {
    const mod = await import('pharmacy/routes') // <— دقیقا همین اسمی که در exposes دادی
    // اگر default بود:
    const routes = (mod as any).default ?? mod
    console.info('[shell] pharmacy ok:', routes)
    return routes
  } catch (e) {
    console.error('[shell] pharmacy failed:', e)
    throw e
  }
}