import { useReducer, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence, motion } from 'framer-motion'
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
    <motion.div
      className={styles.empty}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <span className={styles.emptyIcon}>◎</span>
      <p className={styles.emptyTitle}>Sin resultados para &ldquo;{query}&rdquo;</p>
      <p className={styles.emptyHint}>Prueba con otra marca o modelo</p>
    </motion.div>
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
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'loading' })

    getProducts()
      .then((data) => { if (!cancelled) dispatch({ type: 'success', data }) })
      .catch((err) => { if (!cancelled) dispatch({ type: 'error', message: err.message }) })

    return () => { cancelled = true }
  }, [fetchKey])

  const handleRetry = () => setFetchKey((k) => k + 1)

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
          <motion.h1
            className={styles.pageTitle}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            Catálogo
          </motion.h1>

          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.05 }}
            >
              <SearchBar
                value={query}
                onChange={setQuery}
                resultCount={filtered.length}
              />
            </motion.div>
          )}
        </div>

        {loading && <LoadingGrid />}

        {!loading && error && <ErrorState onRetry={handleRetry} />}

        <AnimatePresence mode="wait">
          {!loading && !error && filtered.length === 0 && query && (
            <EmptyState key="empty" query={query} />
          )}
        </AnimatePresence>

        {/* mode="popLayout": las cards que desaparecen al filtrar animan su salida
            mientras las restantes se recolocan fluidamente con layout */}
        {!loading && !error && filtered.length > 0 && (
          <div className={styles.grid}>
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  brand={product.brand}
                  model={product.model}
                  price={product.price}
                  imgUrl={product.imgUrl}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </>
  )
}

export default ProductListPage
