import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductListPage from './ProductListPage'
import { getProducts } from '../../services/api'

// ─── Mocks ────────────────────────────────────────────────
vi.mock('../../services/api', () => ({
  getProducts: vi.fn(),
}))

// Framer Motion no anima en jsdom — reemplazamos sus componentes por
// elementos HTML normales que pasan todos los props relevantes
vi.mock('framer-motion', async () => {
  const { createElement, forwardRef } = await import('react')

  // Quita los props exclusivos de framer-motion para no contaminar el DOM
  const FRAMER_PROPS = new Set([
    'animate', 'initial', 'exit', 'variants', 'transition',
    'whileHover', 'whileTap', 'whileFocus', 'whileInView',
    'layout', 'layoutId', 'custom', 'drag',
  ])

  const createMotion = (tag) =>
    forwardRef(function MotionEl({ children, ...props }, ref) {
      const clean = Object.fromEntries(
        Object.entries(props).filter(([k]) => !FRAMER_PROPS.has(k))
      )
      return createElement(tag, { ...clean, ref }, children)
    })

  return {
    motion: new Proxy({}, { get: (_, tag) => createMotion(tag) }),
    AnimatePresence: ({ children }) => children,
  }
})

// ─── Fixtures ─────────────────────────────────────────────
const fakeProducts = [
  { id: '1', brand: 'Apple',   model: 'iPhone 14',  price: 799, imgUrl: '' },
  { id: '2', brand: 'Samsung', model: 'Galaxy S23', price: 699, imgUrl: '' },
]

function renderPage() {
  return render(
    <MemoryRouter>
      <ProductListPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  // Cada test parte de una respuesta limpia
  vi.mocked(getProducts).mockResolvedValue(fakeProducts)
})

// ─── Tests ────────────────────────────────────────────────
describe('ProductListPage', () => {
  it('renderiza las cards de producto tras la carga', async () => {
    renderPage()

    // findByText espera a que el efecto async resuelva y el DOM se actualice
    expect(await screen.findByText('iPhone 14')).toBeInTheDocument()
    expect(screen.getByText('Galaxy S23')).toBeInTheDocument()
  })

  it('filtra las cards por marca al escribir en el buscador', async () => {
    renderPage()

    // Esperamos a que los datos carguen antes de interactuar
    await screen.findByText('iPhone 14')

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Apple' } })

    expect(screen.getByText('iPhone 14')).toBeInTheDocument()
    expect(screen.queryByText('Galaxy S23')).not.toBeInTheDocument()
  })

  it('filtra las cards por modelo (case-insensitive)', async () => {
    renderPage()

    await screen.findByText('Galaxy S23')

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'galaxy' } })

    expect(screen.getByText('Galaxy S23')).toBeInTheDocument()
    expect(screen.queryByText('iPhone 14')).not.toBeInTheDocument()
  })
})
