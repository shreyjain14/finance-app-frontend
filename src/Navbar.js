import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-xl">Finance App</div>
          <div>
            <Link 
              to="/add-payment" 
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ${
                location.pathname === '/add-payment' ? 'bg-blue-700' : ''
              }`}
            >
              Add Payment
            </Link>
            <Link 
              to="/view-payments" 
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
                location.pathname === '/view-payments' ? 'bg-green-700' : ''
              }`}
            >
              View Payments
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 z-50"> {/* Added z-50 */}
        <div className="flex justify-around items-center h-16">
          <Link 
            to="/view-payments" 
            className={`text-white text-center ${
              location.pathname === '/view-payments' ? 'text-blue-400' : ''
            }`}
          >
            <div className="text-2xl mb-1">📑</div>
            <div className="text-xs">View</div>
          </Link>
          <Link 
            to="/add-payment" 
            className="bg-blue-500 rounded-full w-14 h-14 flex items-center justify-center -mt-5 text-white text-center shadow-lg"
          >
            <div className="text-3xl">+</div>
          </Link>
          <div className="w-12"></div> {/* Placeholder for balance */}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
