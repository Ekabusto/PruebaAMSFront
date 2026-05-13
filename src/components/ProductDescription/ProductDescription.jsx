import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import styles from './ProductDescription.module.css'

const SPEC_FIELDS = [
  { key: 'brand',             label: 'Marca' },
  { key: 'model',             label: 'Modelo' },
  { key: 'price',             label: 'Precio',              format: (v) => `${v} €` },
  { key: 'cpu',               label: 'Procesador' },
  { key: 'ram',               label: 'RAM' },
  { key: 'os',                label: 'Sistema operativo' },
  { key: 'displayResolution', label: 'Resolución de pantalla' },
  { key: 'battery',           label: 'Batería' },
  { key: 'primaryCamera',     label: 'Cámara trasera' },
  { key: 'secondaryCmera',    label: 'Cámara frontal' },  // typo de la API
  { key: 'dimentions',        label: 'Dimensiones' },      // typo de la API
  { key: 'weight',            label: 'Peso' },
]

// Número de filas visibles antes de expandir
const COLLAPSED_COUNT = 5

const rowVariants = {
  hidden: { opacity: 0, x: 12 },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.035, type: 'spring', stiffness: 300, damping: 26 },
  }),
}

function SpecRow({ label, value }) {
  return (
    <div className={styles.row}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  )
}

SpecRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

export function ProductDescription({ product }) {
  const [expanded, setExpanded] = useState(false)

  const visibleFields = SPEC_FIELDS.filter(({ key }) => {
    const v = product[key]
    return v !== null && v !== undefined && v !== '' && v !== 0
  })

  const collapsedFields = visibleFields.slice(0, COLLAPSED_COUNT)
  const extraFields     = visibleFields.slice(COLLAPSED_COUNT)
  const hasMore         = extraFields.length > 0

  const getValue = ({ key, format }) => {
    const raw = product[key]
    return format ? format(raw) : String(raw)
  }

  return (
    <div>
      <motion.dl className={styles.list} initial="hidden" animate="show">
        {/* Filas siempre visibles con stagger de entrada */}
        {collapsedFields.map((field, i) => (
          <motion.div key={field.key} variants={rowVariants} custom={i}>
            <SpecRow label={field.label} value={getValue(field)} />
          </motion.div>
        ))}

        {/* Filas extra que aparecen/desaparecen con AnimatePresence */}
        <AnimatePresence initial={false}>
          {expanded && extraFields.map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.22, delay: i * 0.025, ease: 'easeOut' }}
            >
              <SpecRow label={field.label} value={getValue(field)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.dl>

      {hasMore && (
        <motion.button
          className={styles.expandBtn}
          onClick={() => setExpanded((v) => !v)}
          whileTap={{ scale: 0.97 }}
          animate={{ opacity: 1 }}
        >
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            style={{ display: 'inline-block', lineHeight: 1 }}
          >
            ↓
          </motion.span>
          {expanded
            ? 'Ver menos'
            : `Ver ${extraFields.length} especificaciones más`}
        </motion.button>
      )}
    </div>
  )
}

ProductDescription.propTypes = {
  product: PropTypes.object.isRequired,
}

export default ProductDescription
