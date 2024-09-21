import React, { useState } from 'react';
import api from './api';

function PaymentForm() {
  const [amount, setAmount] = useState('');
  const [payedTo, setPayedTo] = useState('Zepto');
  const [payedFrom, setPayedFrom] = useState('AMEX');
  const [otherPayedTo, setOtherPayedTo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/payment/create', {
        amount,
        payed_from: payedFrom,
        payed_to: payedTo === 'Other' ? otherPayedTo : payedTo
      });
      console.log('Payment submitted:', response.data);
      alert('Payment submitted successfully');
    } catch (error) {
      console.error('Payment submission failed:', error);
      alert('Payment submission failed. Please try again.');
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '40px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }}>
      <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Submit Payment</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
            required
          />
        </div>
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>Payed To:</label>
          <select
            value={payedTo}
            onChange={(e) => setPayedTo(e.target.value)}
            style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
          >
            <option value="Zepto">Zepto</option>
            <option value="BlinkIt">BlinkIt</option>
            <option value="Amazon">Amazon</option>
            <option value="Other">Other</option>
          </select>
          {payedTo === 'Other' && (
            <input
              type="text"
              value={otherPayedTo}
              onChange={(e) => setOtherPayedTo(e.target.value)}
              placeholder="Specify other"
              style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginTop: '5px'}}
            />
          )}
        </div>
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>Payed From:</label>
          <select
            value={payedFrom}
            onChange={(e) => setPayedFrom(e.target.value)}
            style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
          >
            <option value="AMEX">AMEX</option>
            <option value="BONVOY">BONVOY</option>
            <option value="REGALIA">REGALIA</option>
          </select>
        </div>
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}

export default PaymentForm;
