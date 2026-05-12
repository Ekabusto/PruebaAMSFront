import { useParams } from 'react-router-dom'
import { Header } from '../components/Header/Header'

// Placeholder — el brand/model vendrá del fetch real cuando implementemos la página completa
function ProductDetailPage() {
  const { id } = useParams()

  // Valores provisionales hasta conectar la API
  const brand = 'Brand'
  const model = `Model ${id}`

  return (
    <>
      <Header
        breadcrumb={[
          { label: 'Products', href: '/' },
          { label: `${brand} ${model}` },
        ]}
      />
      <main>
        <h1>Detalle del Producto</h1>
        <p>ID: <strong>{id}</strong></p>
      </main>
    </>
  )
}

export default ProductDetailPage
