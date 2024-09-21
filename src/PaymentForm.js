import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function PaymentForm() {
  const [amount, setAmount] = useState('');
  const [payedFrom, setPayedFrom] = useState('AMEX');
  const [payedTo, setPayedTo] = useState('Zepto');
  const [otherPayedTo, setOtherPayedTo] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await api.post('/payment/create', {
        amount,
        payed_from: payedFrom,
        payed_to: payedTo === 'Other' ? otherPayedTo : payedTo
      });
      
      setSuccessMessage('Payment submitted successfully');
      // Clear form fields
      setAmount('');
      setPayedFrom('AMEX');
      setPayedTo('Zepto');
      setOtherPayedTo('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Payment submission failed:', error);
      if (error.message === 'No token found') {
        setErrorMessage('You need to login first');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage(`Payment submission failed: ${error.message}`);
      }
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Payment</h2>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Paid From:</label>
          <select
            value={payedFrom}
            onChange={(e) => setPayedFrom(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="AMEX">AMEX</option>
            <option value="BONVOY">BONVOY</option>
            <option value="REGALIA">REGALIA</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Paid To:</label>
          <select
            value={payedTo}
            onChange={(e) => setPayedTo(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Zepto">Zepto</option>
            <option value="BlinkIt">Blink It</option>
            <option value="Amazon">Amazon</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {payedTo === 'Other' && (
          <div>
            <label className="block mb-1">Specify Other:</label>
            <input
              type="text"
              value={otherPayedTo}
              onChange={(e) => setOtherPayedTo(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit Payment
        </button>
      </form>
    </div>
  );
}

export default PaymentForm;
