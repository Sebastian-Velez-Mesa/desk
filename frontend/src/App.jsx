import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <span style={{ fontSize: '1.5rem' }}>🌿</span> EcoMarket
        </Link>
        <div className="nav-links">
          <Link to="/">Tienda</Link>
          <Link to="/cart">Carrito</Link>
          {user ? (
            <>
              <Link to="/orders">Mis Pedidos</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
                <span style={{ color: 'var(--primary-dark)', fontSize: '0.9rem' }}>Hola, {user.name}</span>
                <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.4rem 0.8rem' }}>Salir</button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px' }}>Entrar</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <footer style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--border)', marginTop: '4rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>&copy; 2026 EcoMarket - ADSO SENA. Todos los derechos reservados.</p>
      </footer>
    </Router>
  );
}

export default App;
