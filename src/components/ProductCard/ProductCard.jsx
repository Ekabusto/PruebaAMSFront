import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './ProductCard.module.css'

export function ProductCard({ id, brand, model, price, imgUrl, style }) {
  const navigate = useNavigate()

  const handleClick = () => navigate(`/product/${id}`)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleClick()
  }

  // Formatea el precio: si es número lo fija a 2 decimales, si no lo muestra tal cual
  const formattedPrice =
    typeof price === 'number' ? price.toFixed(2) : price

  return (
    <article
      className={styles.card}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${brand} ${model}, ${formattedPrice} €`}
      style={style}
    >
      <div className={styles.imageWrapper}>
        <img
          src={imgUrl}
          alt={`${brand} ${model}`}
          className={styles.image}
          loading="lazy"
          // Fallback silencioso si la imagen no carga
          onError={(e) => { e.currentTarget.style.opacity = '0' }}
        />
      </div>

      <div className={styles.info}>
        <span className={styles.brand}>{brand}</span>
        <span className={styles.model}>{model}</span>
        <span className={styles.price}>{formattedPrice} €</span>
      </div>
    </article>
  )
}

ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  imgUrl: PropTypes.string,
  style: PropTypes.object,
}

export default ProductCard
