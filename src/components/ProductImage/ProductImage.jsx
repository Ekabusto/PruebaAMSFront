import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import styles from './ProductImage.module.css'

export function ProductImage({ src, alt }) {
  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 240, damping: 26 }}
    >
      {/* Glow radial detrás del teléfono — sutil toque premium */}
      <div className={styles.glow} aria-hidden="true" />
      <img
        src={src}
        alt={alt}
        className={styles.image}
        onError={(e) => { e.currentTarget.style.opacity = '0' }}
      />
    </motion.div>
  )
}

ProductImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
}

export default ProductImage
