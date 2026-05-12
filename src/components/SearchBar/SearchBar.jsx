import PropTypes from 'prop-types'
import styles from './SearchBar.module.css'

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function SearchBar({ value, onChange, resultCount }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <span className={styles.icon}>
          <SearchIcon />
        </span>
        <input
          type="search"
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar por marca o modelo…"
          aria-label="Buscar productos"
        />
      </div>
      <p className={styles.count} aria-live="polite" aria-atomic="true">
        {resultCount} {resultCount === 1 ? 'producto encontrado' : 'productos encontrados'}
      </p>
    </div>
  )
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  resultCount: PropTypes.number.isRequired,
}

export default SearchBar
