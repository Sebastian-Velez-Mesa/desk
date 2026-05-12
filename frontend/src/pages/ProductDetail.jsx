import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Producto añadido al carrito');
    navigate('/cart');
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Cargando...</div>;
  if (!product) return <div className="container">Producto no encontrado</div>;

  return (
    <div className="container">
      <div className="product-detail">
        <div>
          <img src={product.imageUrl} alt={product.name} className="detail-image" />
        </div>
        <div>
          <span className="product-category">{product.category}</span>
          <h1 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>{product.name}</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '2rem' }}>
            ${product.price.toFixed(2)}
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {product.description}
          </p>
          <div style={{ marginBottom: '2rem' }}>
            <p><strong>Disponibilidad:</strong> {product.stock} unidades</p>
          </div>
          <button 
            className="btn-primary" 
            onClick={addToCart}
            disabled={product.stock === 0}
            style={{ padding: '1.25rem' }}
          >
            {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
