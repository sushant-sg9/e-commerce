import React from 'react'
import { useCart } from '../Cart/CartContext'
import { FiArrowLeft, FiShoppingBag, FiLock, FiCheckCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const subtotal = getCartTotal()
  const shipping = 10.00
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handlePlaceOrder = () => {
    alert("Order placed successfully!")
    clearCart()
    navigate('/')
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#131419] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-cyan-400 transition-colors mr-4"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
            Checkout
          </h1>
        </div>

        <div className="bg-[#1c1d24] rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[#131419] text-2xl font-bold">Order Summary</h2>
              <div className="flex items-center text-[#131419]">
                <FiShoppingBag className="mr-2" size={20} />
                <span className="font-medium">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Your Items</h3>
              <div className="space-y-4 divide-y divide-gray-700">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center py-4 group hover:bg-[#252631] rounded-lg transition-all px-2">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-700 group-hover:border-cyan-400 transition-all mr-4">
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-gray-400 text-sm mt-1">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#252631] rounded-2xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Order Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-700 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-xl font-bold text-cyan-400">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-8">
                <button 
                  onClick={handlePlaceOrder}
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#131419] py-4 rounded-lg font-bold text-lg hover:from-cyan-400 hover:to-cyan-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-cyan-500/20 hover:shadow-lg"
                >
                  Place Order
                </button>
                <div className="flex items-center justify-center mt-4 text-gray-400 text-sm">
                  <FiLock className="mr-2" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-cyan-400 transition-colors underline"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center space-x-6 text-gray-400">
          <div className="flex flex-col items-center">
            <FiCheckCircle size={24} className="mb-2" />
            <span className="text-sm">Secure Payment</span>
          </div>
          <div className="flex flex-col items-center">
            <FiCheckCircle size={24} className="mb-2" />
            <span className="text-sm">Fast Shipping</span>
          </div>
          <div className="flex flex-col items-center">
            <FiCheckCircle size={24} className="mb-2" />
            <span className="text-sm">Money-Back Guarantee</span>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Checkout