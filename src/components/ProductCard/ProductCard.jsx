import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import styles from './ProductCard.module.css'

// Variantes compartidas — el padre las activa con staggerChildren
export const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      type: 'spring',
      stiffness: 280,
      damping: 22,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
}

export function ProductCard({ id, brand, model, price, imgUrl, index }) {
  const navigate = useNavigate()

  const formattedPrice =
    typeof price === 'number' ? price.toFixed(2) : price

  return (
    <motion.article
      className={styles.card}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      custom={index}
      layout
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/product/${id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/product/${id}`) }}
      role="button"
      tabIndex={0}
      aria-label={`${brand} ${model}, ${formattedPrice} €`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={imgUrl}
          alt={`${brand} ${model}`}
          className={styles.image}
          loading="lazy"
          onError={(e) => { e.currentTarget.style.opacity = '0' }}
        />
      </div>

      <div className={styles.info}>
        <span className={styles.brand}>{brand}</span>
        <span className={styles.model}>{model}</span>
        <span className={styles.price}>{formattedPrice} €</span>
      </div>
    </motion.article>
  )
}

ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  imgUrl: PropTypes.string,
  index: PropTypes.number,
}

export default ProductCard
