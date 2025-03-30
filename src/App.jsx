import React from "react"
import Home from "./Components/Home"
import { AuthProvider } from './Context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './ProtectedRoutes/ProtectedRoutes';
import Checkout from "./Components/Checkout";
import { CartProvider } from "./Cart/CartContext";
import SingleProduct from "./Components/SingleProduct";

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<SingleProduct />} />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
              
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App