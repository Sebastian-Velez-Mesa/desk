import { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Cargando tus pedidos...</div>;

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Mis Pedidos</h1>
      {orders.length === 0 ? (
        <p>Aún no has realizado ninguna compra.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Orden #{order.id}</p>
                  <p style={{ fontWeight: '600' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--primary)', fontWeight: '700' }}>{order.status}</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>${order.total.toFixed(2)}</p>
                </div>
              </div>
              <div>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
