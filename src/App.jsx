import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
