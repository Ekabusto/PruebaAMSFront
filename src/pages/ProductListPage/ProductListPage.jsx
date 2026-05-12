import { useReducer, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Header } from '../../components/Header/Header'
import { SearchBar } from '../../components/SearchBar/SearchBar'
import { ProductCard } from '../../components/ProductCard/ProductCard'
import { getProducts } from '../../services/api'
import styles from './ProductListPage.module.css'

// ─── Skeleton loading ──────────────────────────────────────
function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineSm}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineXs}`} />
      </div>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className={styles.grid} aria-busy="true" aria-label="Cargando productos">
      {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}

// ─── Estado vacío ──────────────────────────────────────────
function EmptyState({ query }) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>◎</span>
      <p className={styles.emptyTitle}>Sin resultados para &ldquo;{query}&rdquo;</p>
      <p className={styles.emptyHint}>Prueba con otra marca o modelo</p>
    </div>
  )
}

EmptyState.propTypes = {
  query: PropTypes.string.isRequired,
}

// ─── Estado de error ───────────────────────────────────────
function ErrorState({ onRetry }) {
  return (
    <div className={styles.error}>
      <span className={styles.errorIcon}>⚠</span>
      <p className={styles.errorTitle}>No se pudieron cargar los productos</p>
      <button className={styles.retryBtn} onClick={onRetry}>
        Reintentar
      </button>
    </div>
  )
}

ErrorState.propTypes = {
  onRetry: PropTypes.func.isRequired,
}

// ─── Reducer para el estado de la petición ────────────────
// Agrupa loading/error/products en un solo dispatch, evitando
// múltiples re-renders y la restricción de setState en efectos
const initialFetchState = { products: [], loading: true, error: null }

function fetchReducer(state, action) {
  switch (action.type) {
    case 'loading': return { ...state, loading: true, error: null }
    case 'success': return { products: action.data, loading: false, error: null }
    case 'error':   return { ...state, loading: false, error: action.message }
    default:        return state
  }
}

// ─── Página principal ──────────────────────────────────────
function ProductListPage() {
  const [{ products, loading, error }, dispatch] = useReducer(fetchReducer, initialFetchState)
  const [query, setQuery] = useState('')
  // fetchKey actúa como disparador: incrementarlo fuerza una nueva llamada a la API
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'loading' })

    getProducts()
      .then((data) => { if (!cancelled) dispatch({ type: 'success', data }) })
      .catch((err) => { if (!cancelled) dispatch({ type: 'error', message: err.message }) })

    // Limpieza: si el componente se desmonta antes de que acabe el fetch,
    // ignoramos la respuesta para no actualizar estado en un componente muerto
    return () => { cancelled = true }
  }, [fetchKey])

  const handleRetry = () => setFetchKey((k) => k + 1)

  // Filtra por marca O modelo, sin distinción de mayúsculas ni espacios sobrantes
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q)
    )
  }, [products, query])

  return (
    <>
      <Header breadcrumb={[{ label: 'Products' }]} />

      <main className={styles.page}>
        <div className={styles.toolbar}>
          <h1 className={styles.pageTitle}>Catálogo</h1>
          {!loading && !error && (
            <SearchBar
              value={query}
              onChange={setQuery}
              resultCount={filtered.length}
            />
          )}
        </div>

        {loading && <LoadingGrid />}

        {!loading && error && <ErrorState onRetry={handleRetry} />}

        {!loading && !error && filtered.length === 0 && query && (
          <EmptyState query={query} />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className={styles.grid}>
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                id={product.id}
                brand={product.brand}
                model={product.model}
                price={product.price}
                imgUrl={product.imgUrl}
                style={{ '--delay': `${i * 40}ms` }}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default ProductListPage
