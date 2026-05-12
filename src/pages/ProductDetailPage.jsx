// Página de detalle de producto - placeholder
import { useParams } from 'react-router-dom'

function ProductDetailPage() {
  const { id } = useParams()

  return (
    <main>
      <h1>Detalle del Producto</h1>
      <p>Mostrando detalle del producto con ID: <strong>{id}</strong></p>
    </main>
  )
}

export default ProductDetailPage
