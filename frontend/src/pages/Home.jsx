import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Cargando productos...</div>;

  return (
    <div className="container">
      <header style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Productos Sostenibles</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Cuidamos el planeta con cada compra.</p>
      </header>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Stock: {product.stock}</p>
              <Link to={`/product/${product.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
                Ver Detalle
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
