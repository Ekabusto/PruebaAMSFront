import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductListPage from './ProductListPage'

describe('ProductListPage', () => {
  it('renderiza el título de la página', () => {
    render(<ProductListPage />)
    expect(screen.getByRole('heading', { name: /lista de productos/i })).toBeInTheDocument()
  })
})
