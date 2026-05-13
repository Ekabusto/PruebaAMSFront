import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renderiza un campo de búsqueda', () => {
    render(<SearchBar value="" onChange={() => {}} resultCount={0} />)

    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('llama a onChange con el valor nuevo en cada pulsación', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} resultCount={10} />)

    const input = screen.getByRole('searchbox')

    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.change(input, { target: { value: 'ap' } })

    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenNthCalledWith(1, 'a')
    expect(onChange).toHaveBeenNthCalledWith(2, 'ap')
  })
})
