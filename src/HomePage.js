import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function HomePage() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Filter states
  const [paymentMethod, setPaymentMethod] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [paidTo, setPaidTo] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await api.get('/payment/get');
        const sortedPayments = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPayments(sortedPayments);
        setFilteredPayments(sortedPayments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        if (error.message === 'No token found') {
          navigate('/login');
        } else {
          setError('Failed to fetch payments. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchPayments();
  }, [navigate]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = payments;

      if (paymentMethod) {
        filtered = filtered.filter(payment => payment.payed_from === paymentMethod);
      }

      if (minAmount) {
        filtered = filtered.filter(payment => payment.amount >= parseFloat(minAmount));
      }

      if (maxAmount) {
        filtered = filtered.filter(payment => payment.amount <= parseFloat(maxAmount));
      }

      if (paidTo) {
        filtered = filtered.filter(payment => payment.payed_to.toLowerCase().includes(paidTo.toLowerCase()));
      }

      setFilteredPayments(filtered);
    };

    applyFilters();
  }, [payments, paymentMethod, minAmount, maxAmount, paidTo]);

  if (loading) return <div className="text-center mt-10">Loading payments...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      
      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Payment Methods</option>
          <option value="AMEX">AMEX</option>
          <option value="BONVOY">BONVOY</option>
          <option value="REGALIA">REGALIA</option>
        </select>
        <input
          type="number"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Paid To"
          value={paidTo}
          onChange={(e) => setPaidTo(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Payments List */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredPayments.map(payment => (
          <div key={payment.id} className="bg-white shadow-md rounded p-4">
            <div className="font-bold text-xl mb-2">₹{payment.amount}</div>
            <p className="text-gray-700">Paid to: {payment.payed_to}</p>
            <p className="text-gray-700">Paid from: {payment.payed_from}</p>
            <p className="text-gray-700">
              Date: {new Date(payment.date).toLocaleDateString()} {new Date(payment.date).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
