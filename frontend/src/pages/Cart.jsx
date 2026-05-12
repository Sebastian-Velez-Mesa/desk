import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../services/api';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para comprar');
      navigate('/login');
      return;
    }

    try {
      const items = cart.map(item => ({ productId: item.id, quantity: item.quantity }));
      await createOrder(items);
      alert('¡Pedido realizado con éxito!');
      localStorage.removeItem('cart');
      navigate('/orders');
    } catch (err) {
      alert(err.message);
    }
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Tu carrito está vacío</h2>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '2rem', width: 'auto' }}>
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Tu Carrito</h1>
      <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-muted)' }}>Cantidad: {item.quantity}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: '700' }}>${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeItem(item.id)} style={{ color: 'var(--error)', background: 'transparent', fontSize: '0.85rem' }}>
                Eliminar
              </button>
            </div>
          </div>
        ))}

        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            Total: <strong>${total.toFixed(2)}</strong>
          </p>
          <button className="btn-primary" onClick={handleCheckout} style={{ width: 'auto', padding: '1rem 3rem' }}>
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
