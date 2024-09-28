import React, { useState, useEffect, useCallback } from 'react';
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

  // Deletion states
  const [deletingPaymentId, setDeletingPaymentId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const fetchPayments = useCallback(async () => {
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
  }, [navigate]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

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

  const handleDeleteClick = (id) => {
    setDeletingPaymentId(id);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log('Deleting payment with ID:', deletingPaymentId);
      const response = await api.delete('/payment/delete', { id: deletingPaymentId });
      console.log('Delete response:', response);
      fetchPayments(); // Refresh the payments list after successful deletion
      setDeletingPaymentId(null);
    } catch (error) {
      console.error('Error deleting payment:', error);
      setDeleteError(`Failed to delete payment: ${error.message}`);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingPaymentId(null);
    setDeleteError(null);
  };

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
          <div key={payment.id} className="bg-white shadow-md rounded p-4 relative">
            <div className="font-bold text-xl mb-2">₹{payment.amount}</div>
            <p className="text-gray-700">Paid to: {payment.payed_to}</p>
            <p className="text-gray-700">Paid from: {payment.payed_from}</p>
            <p className="text-gray-700">
              Date: {new Date(payment.date).toLocaleString(undefined, { 
                timeZone: 'UTC', 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
              })}
            </p>
            <button
              onClick={() => handleDeleteClick(payment.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              aria-label="Delete payment"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingPaymentId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Payment</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this payment? This action cannot be undone.
                </p>
              </div>
              {deleteError && (
                <p className="text-red-500 text-sm mt-2">{deleteError}</p>
              )}
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
                <button
                  id="cancel-btn"
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-24 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={handleDeleteCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
