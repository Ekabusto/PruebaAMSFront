import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProductActions } from './ProductActions'
import { addToCart } from '../../services/api'

// ─── Mocks ────────────────────────────────────────────────
vi.mock('../../services/api', () => ({
  addToCart: vi.fn(),
}))

vi.mock('framer-motion', async () => {
  const { createElement, forwardRef } = await import('react')

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
const multipleOptions = {
  id: 'PROD-01',
  options: {
    storages: [
      { code: 64,  name: '64 GB' },
      { code: 128, name: '128 GB' },
    ],
    colors: [
      { code: 1000, name: 'Black' },
      { code: 1001, name: 'White' },
    ],
  },
}

const singleOptions = {
  id: 'PROD-02',
  options: {
    storages: [{ code: 64, name: '64 GB' }],
    colors:   [{ code: 1000, name: 'Black' }],
  },
}

beforeEach(() => {
  vi.mocked(addToCart).mockResolvedValue({ count: 1 })
  localStorage.clear()
})

// ─── Tests ────────────────────────────────────────────────
describe('ProductActions', () => {
  it('renderiza chips de almacenamiento y color con las opciones del producto', () => {
    render(<ProductActions product={multipleOptions} />)

    expect(screen.getByText('64 GB')).toBeInTheDocument()
    expect(screen.getByText('128 GB')).toBeInTheDocument()
    expect(screen.getByText('Black')).toBeInTheDocument()
    expect(screen.getByText('White')).toBeInTheDocument()
  })

  it('preselecciona el chip cuando solo hay una opción disponible', () => {
    render(<ProductActions product={singleOptions} />)

    // aria-pressed="true" indica que el chip está seleccionado
    expect(screen.getByRole('button', { name: '64 GB' }))
      .toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Black' }))
      .toHaveAttribute('aria-pressed', 'true')
  })

  it('el botón de añadir está deshabilitado si no hay selección completa', () => {
    // multipleOptions tiene varias opciones → ninguna preseleccionada → botón disabled
    render(<ProductActions product={multipleOptions} />)

    expect(screen.getByText('Añadir al carrito')).toBeDisabled()
  })

  it('llama a addToCart con el payload correcto al pulsar el botón', async () => {
    render(<ProductActions product={singleOptions} />)

    // Con una sola opción por selector, el botón ya está habilitado
    const btn = screen.getByText('Añadir al carrito')
    expect(btn).not.toBeDisabled()

    fireEvent.click(btn)

    await waitFor(() => {
      expect(addToCart).toHaveBeenCalledWith({
        id:          'PROD-02',
        colorCode:   1000, // Number(String(1000))
        storageCode: 64,   // Number(String(64))
      })
    })
  })
})
