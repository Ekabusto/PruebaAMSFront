import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './Header.module.css'

function CartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

// Lee el contador desde localStorage cada vez que el carrito se actualiza
function useCartCount() {
  const [count, setCount] = useState(() =>
    parseInt(localStorage.getItem('cartCount') || '0', 10)
  )

  useEffect(() => {
    const sync = () => setCount(parseInt(localStorage.getItem('cartCount') || '0', 10))
    window.addEventListener('cartUpdated', sync)
    return () => window.removeEventListener('cartUpdated', sync)
  }, [])

  return count
}

// breadcrumb: [{ label, href? }, ...]
// Ejemplo en "/":             [{ label: 'Products' }]
// Ejemplo en "/product/:id":  [{ label: 'Products', href: '/' }, { label: 'iPhone 14 Pro' }]
export function Header({ breadcrumb = [] }) {
  const cartCount = useCartCount()

  return (
    <header className={styles.header}>
      {/* Logo / home link */}
      <Link to="/" className={styles.logo} aria-label="Ir a la página principal">
        <span className={styles.logoMark}>▪</span>
        AMS Phone Store
      </Link>

      {/* Breadcrumb de navegación */}
      <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
        {breadcrumb.map((crumb, i) => (
          <span key={i} className={styles.crumbGroup}>
            {i > 0 && <span className={styles.separator} aria-hidden="true">›</span>}
            {crumb.href ? (
              <Link to={crumb.href} className={styles.crumbLink}>{crumb.label}</Link>
            ) : (
              <span className={styles.crumbCurrent} aria-current="page">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Carrito con contador */}
      <Link to="/cart" className={styles.cart} aria-label={`Carrito, ${cartCount} artículos`}>
        <CartIcon />
        <span className={`${styles.cartBadge} ${cartCount === 0 ? styles.cartBadgeEmpty : ''}`}>
          {cartCount}
        </span>
      </Link>
    </header>
  )
}

Header.propTypes = {
  breadcrumb: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ),
}

export default Header
