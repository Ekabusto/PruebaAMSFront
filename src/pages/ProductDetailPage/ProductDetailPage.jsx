import { useReducer, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { Header } from '../../components/Header/Header'
import { ProductImage } from '../../components/ProductImage/ProductImage'
import { ProductDescription } from '../../components/ProductDescription/ProductDescription'
import { ProductActions } from '../../components/ProductActions/ProductActions'
import { getProductById } from '../../services/api'
import styles from './ProductDetailPage.module.css'

// ─── Reducer (mismo patrón que ProductListPage) ────────────
const initialState = { product: null, loading: true, error: null }

function reducer(state, action) {
  switch (action.type) {
    case 'loading': return { ...state, loading: true, error: null }
    case 'success': return { product: action.data, loading: false, error: null }
    case 'error':   return { ...state, loading: false, error: action.message }
    default:        return state
  }
}

// ─── Skeleton de carga ─────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className={styles.layout}>
      <div className={`${styles.skeletonBlock} ${styles.skeletonImage}`} />
      <div className={styles.skeletonInfo}>
        <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeletonBlock} ${styles.skeletonSub}`} />
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className={styles.skeletonRow}>
            <div className={`${styles.skeletonBlock} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeletonBlock} ${styles.skeletonValue}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Estado de error ───────────────────────────────────────
function ErrorState({ message }) {
  return (
    <div className={styles.error}>
      <span>⚠</span>
      <p>{message || 'No se pudo cargar el producto'}</p>
    </div>
  )
}

ErrorState.propTypes = {
  message: PropTypes.string,
}

// ─── Página ────────────────────────────────────────────────
function ProductDetailPage() {
  const { id } = useParams()
  const [{ product, loading, error }, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'loading' })

    getProductById(id)
      .then((data) => { if (!cancelled) dispatch({ type: 'success', data }) })
      .catch((err) => { if (!cancelled) dispatch({ type: 'error', message: err.message }) })

    return () => { cancelled = true }
  }, [id])

  // Mientras carga usamos un breadcrumb provisional
  const brand = product?.brand ?? ''
  const model = product?.model ?? ''

  const breadcrumb = [
    { label: 'Products', href: '/' },
    { label: loading ? '…' : `${brand} ${model}` },
  ]

  return (
    <>
      <Header breadcrumb={breadcrumb} />

      <main className={styles.page}>
        {/* Link de retorno explícito requerido por el enunciado */}
        <Link to="/" className={styles.backLink}>
          ← Volver a productos
        </Link>

        {loading && <DetailSkeleton />}

        {!loading && error && <ErrorState message={error} />}

        {!loading && !error && product && (
          <div className={styles.layout}>
            {/* Columna izquierda: imagen */}
            <motion.div
              className={styles.imageCol}
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            >
              <ProductImage
                src={product.imgUrl}
                alt={`${brand} ${model}`}
              />
            </motion.div>

            {/* Columna derecha: título + specs + acciones */}
            <motion.div
              className={styles.infoCol}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.06 }}
            >
              <div className={styles.titleBlock}>
                <motion.span
                  className={styles.brand}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12 }}
                >
                  {brand}
                </motion.span>
                <motion.h1
                  className={styles.model}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.16 }}
                >
                  {model}
                </motion.h1>
                <motion.p
                  className={styles.price}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.22 }}
                >
                  {typeof product.price === 'number'
                    ? product.price.toFixed(2)
                    : product.price} €
                </motion.p>
              </div>

              <ProductDescription product={product} />
              <ProductActions product={product} />
            </motion.div>
          </div>
        )}
      </main>
    </>
  )
}

export default ProductDetailPage
