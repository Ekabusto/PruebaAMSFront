const BASE_URL = 'https://itx-frontend-test.onrender.com'
const CACHE_TTL = 3600000 // 1 hora en milisegundos

// Devuelve los datos cacheados si existen y no han caducado, null en caso contrario
function getFromCache(key) {
  const raw = localStorage.getItem(`cache_${key}`)
  if (!raw) return null

  const { data, timestamp } = JSON.parse(raw)
  const isExpired = Date.now() - timestamp > CACHE_TTL
  return isExpired ? null : data
}

function saveToCache(key, data) {
  localStorage.setItem(`cache_${key}`, JSON.stringify({ data, timestamp: Date.now() }))
}

async function fetchJSON(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
  return res.json()
}

export async function getProducts() {
  const cacheKey = 'products'
  const cached = getFromCache(cacheKey)
  if (cached) return cached

  const data = await fetchJSON('/api/product')
  saveToCache(cacheKey, data)
  return data
}

export async function getProductById(id) {
  const cacheKey = `product_${id}`
  const cached = getFromCache(cacheKey)
  if (cached) return cached

  const data = await fetchJSON(`/api/product/${id}`)
  saveToCache(cacheKey, data)
  return data
}

// El carrito no se cachea porque modifica estado en el servidor
export async function addToCart({ id, colorCode, storageCode }) {
  const res = await fetch(`${BASE_URL}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, colorCode, storageCode }),
  })
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
  return res.json() // { count }
}
