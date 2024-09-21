import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import LoginPage from './LoginPage';
import PaymentForm from './PaymentForm';
import HomePage from './HomePage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow overflow-y-auto pb-16 md:pb-0">
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/add-payment" /> : <LoginPage />} />
            <Route 
              path="/add-payment" 
              element={isAuthenticated ? <PaymentForm /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/view-payments" 
              element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/add-payment" /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
