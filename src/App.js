import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import PaymentForm from './PaymentForm';
import HomePage from './HomePage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage />} />
        <Route 
          path="/payment" 
          element={isAuthenticated ? <PaymentForm /> : <Navigate to="/login" />}
        />
        <Route 
          path="/home" 
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
