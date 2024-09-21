import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from './HomePage';
import PaymentForm from './PaymentForm';
import LoginPage from './LoginPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/add-payment" element={<PaymentForm />} />
          <Route path="/view-payments" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
