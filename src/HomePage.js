import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function HomePage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await api.get('/payments/get');
      setPayments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to fetch payments. Please try again later.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/payment/delete/${id}`);
      // Refresh the payments list after successful deletion
      fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('Failed to delete payment. Please try again.');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading payments...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {payments.map(payment => (
          <div key={payment.id} className="bg-white shadow-md rounded p-4 relative">
            <div className="font-bold text-xl mb-2">${payment.amount}</div>
            <p className="text-gray-700">Paid to: {payment.payed_to}</p>
            <p className="text-gray-700">Paid from: {payment.payed_from}</p>
            <p className="text-gray-700">
              Date: {new Date(payment.date).toLocaleDateString()} {new Date(payment.date).toLocaleTimeString()}
            </p>
            <button
              onClick={() => handleDelete(payment.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              aria-label="Delete payment"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
