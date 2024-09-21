import React, { useState, useEffect } from 'react';
import api from './api';
import './HomePage.css';

function HomePage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        console.log('Fetching payments...');
        const data = await api.get('/payment/get');
        console.log('Received data:', data);
        if (Array.isArray(data)) {
          const sortedPayments = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setPayments(sortedPayments);
        } else {
          console.error('Received data is not an array:', data);
          setError('Received invalid data format from server');
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError(`Failed to fetch payments: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <div className="loading">Loading payments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-page">
      <h1>Payment History</h1>
      <div className="payment-grid">
        {payments.map(payment => (
          <div key={payment.id} className="payment-card">
            <div className="payment-amount">${payment.amount}</div>
            <div className="payment-details">
              <p>Paid to: {payment.payed_to}</p>
              <p>Paid from: {payment.payed_from}</p>
              <p>Date: {new Date(payment.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
