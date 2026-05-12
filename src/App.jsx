import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header/Header'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

// Componente separado para poder usar useLocation dentro del Router
function AppLayout() {
  return (
    <>
      {/* El breadcrumb lo gestiona cada página pasándolo como prop,
          pero aquí mostramos el header con un breadcrumb por defecto.
          Las páginas individuales renderizarán su propio Header. */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header breadcrumb={[{ label: 'Products' }]} />
              <ProductListPage />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={<ProductDetailPage />}
        />
      </Routes>
    </>
  )
}

export default App
