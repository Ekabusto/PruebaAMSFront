import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { addToCart } from '../../services/api'
import styles from './ProductActions.module.css'

// Grupo de chips para seleccionar una opción (almacenamiento o color)
function OptionGroup({ label, options, selected, onSelect }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.chips}>
        {options.map((opt) => {
          const val = String(opt.code)
          const isSelected = selected === val
          return (
            <motion.button
              key={opt.code}
              type="button"
              className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
              onClick={() => onSelect(val)}
              whileTap={{ scale: 0.93 }}
              // Pequeño rebote al seleccionar
              animate={isSelected ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              aria-pressed={isSelected}
            >
              {opt.name}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

OptionGroup.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.number,
    name: PropTypes.string,
  })).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export function ProductActions({ product }) {
  const { id, options } = product
  const storages = options?.storages ?? []
  const colors   = options?.colors   ?? []

  const [storageCode, setStorageCode] = useState(
    () => storages.length === 1 ? String(storages[0].code) : ''
  )
  const [colorCode, setColorCode] = useState(
    () => colors.length === 1 ? String(colors[0].code) : ''
  )
  const [adding,   setAdding]   = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [addError, setAddError] = useState(null)

  const canAdd = storageCode !== '' && colorCode !== '' && !adding

  const handleAdd = async () => {
    if (!canAdd) return
    setAdding(true)
    setAddError(null)

    try {
      const result = await addToCart({
        id,
        colorCode:   Number(colorCode),
        storageCode: Number(storageCode),
      })
      localStorage.setItem('cartCount', String(result.count))
      window.dispatchEvent(new Event('cartUpdated'))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    } catch {
      setAddError('No se pudo añadir. Inténtalo de nuevo.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.2 }}
    >
      {storages.length > 0 && (
        <OptionGroup
          label="Almacenamiento"
          options={storages}
          selected={storageCode}
          onSelect={setStorageCode}
        />
      )}

      {colors.length > 0 && (
        <OptionGroup
          label="Color"
          options={colors}
          selected={colorCode}
          onSelect={setColorCode}
        />
      )}

      <motion.button
        className={styles.addBtn}
        onClick={handleAdd}
        disabled={!canAdd}
        whileTap={canAdd ? { scale: 0.97 } : {}}
      >
        {adding
          ? <span className={styles.spinner} aria-label="Añadiendo…" />
          : 'Añadir al carrito'
        }
      </motion.button>

      <AnimatePresence mode="wait">
        {success && (
          <motion.p
            key="success"
            className={styles.toast}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            ✓ Añadido al carrito
          </motion.p>
        )}
        {addError && !success && (
          <motion.p
            key="error"
            className={`${styles.toast} ${styles.toastError}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {addError}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

ProductActions.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      storages: PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.number, name: PropTypes.string })),
      colors:   PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.number, name: PropTypes.string })),
    }),
  }).isRequired,
}

export default ProductActions
