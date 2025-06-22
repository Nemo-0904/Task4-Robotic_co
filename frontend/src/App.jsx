import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToHash'; // Works as ScrollToTop too

// Pages (Lazy load for performance; optional)
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const ToolsPage = React.lazy(() => import('./pages/ToolsPage'));
const PaymentSuccessPage = React.lazy(() => import('./pages/PaymentSuccessPage'));
const PaymentCancelledPage = React.lazy(() => import('./pages/PaymentCancelledPage'));

// Styles
import './styles/global.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Authentication check
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Navbar onShowCartClick={() => setIsCartOpen(true)} />
        
        <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/products"
              element={
                <ProductsPage
                  isCartOpen={isCartOpen}
                  setIsCartOpen={setIsCartOpen}
                />
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/success" element={<PaymentSuccessPage />} />
            <Route path="/cancel" element={<PaymentCancelledPage />} />

            {/* Protected Route for /control */}
            <Route
              path="/control"
              element={
                isAuthenticated ? (
                  <ToolsPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Catch-all route (optional) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
