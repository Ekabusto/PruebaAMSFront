import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getProducts, addToCart } from './api'

const BASE_URL   = 'https://itx-frontend-test.onrender.com'
const CACHE_KEY  = 'cache_products'
const TTL        = 3_600_000 // 1 hora en ms

const fakeProducts = [
  { id: '1', brand: 'Apple',   model: 'iPhone 14',  price: 799 },
  { id: '2', brand: 'Samsung', model: 'Galaxy S23', price: 699 },
]

// Helper: crea un fetch mock que devuelve data con ok:true
function mockFetch(data) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  }))
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// ─── getProducts ───────────────────────────────────────────
describe('getProducts()', () => {
  it('llama a fetch y guarda el resultado en localStorage cuando no hay caché', async () => {
    mockFetch(fakeProducts)

    const result = await getProducts()

    expect(fetch).toHaveBeenCalledOnce()
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/product`)
    expect(result).toEqual(fakeProducts)

    const stored = JSON.parse(localStorage.getItem(CACHE_KEY))
    expect(stored.data).toEqual(fakeProducts)
    // El timestamp guardado debe ser muy reciente (menos de 1 segundo de margen)
    expect(stored.timestamp).toBeGreaterThan(Date.now() - 1_000)
  })

  it('devuelve el dato cacheado y NO llama a fetch cuando la caché es válida', async () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: fakeProducts,
      timestamp: Date.now(),
    }))
    mockFetch([]) // devolvería vacío si se llamara — no debería ocurrir

    const result = await getProducts()

    expect(fetch).not.toHaveBeenCalled()
    expect(result).toEqual(fakeProducts)
  })

  it('llama a fetch cuando la caché está expirada (> 1 hora)', async () => {
    const freshProducts = [{ id: '3', brand: 'Sony', model: 'Xperia 1', price: 999 }]

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: fakeProducts,
      timestamp: Date.now() - (TTL + 1), // exactamente 1ms pasada la hora
    }))
    mockFetch(freshProducts)

    const result = await getProducts()

    expect(fetch).toHaveBeenCalledOnce()
    expect(result).toEqual(freshProducts)
  })
})

// ─── addToCart ─────────────────────────────────────────────
describe('addToCart()', () => {
  it('siempre llama a fetch con POST y nunca toca la caché', async () => {
    mockFetch({ count: 3 })

    const payload = { id: 'abc-123', colorCode: 1000, storageCode: 64 }
    const result  = await addToCart(payload)

    expect(fetch).toHaveBeenCalledOnce()
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/cart`,
      expect.objectContaining({
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
    )
    expect(result).toEqual({ count: 3 })

    // El carrito no debe escribir ninguna clave de caché en localStorage
    expect(localStorage.getItem('cache_cart')).toBeNull()
    expect(localStorage.length).toBe(0)
  })
})
