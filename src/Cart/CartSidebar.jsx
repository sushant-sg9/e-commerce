import { useEffect, useRef } from "react"
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi"
import { useCart } from "./CartContext"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"

const CartSidebar = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate() 
  const cartRef = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target) && isCartOpen) {
        setIsCartOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isCartOpen, setIsCartOpen])


  if (!isCartOpen) return null

  const total = getCartTotal()
  const handleCheckout = () => {
    if (!user) {
      alert("Please login to continue to checkout")
    } else {
      navigate("/checkout")
      setIsCartOpen(false) 
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden"
        onClick={() => setIsCartOpen(false)}
      />

      <div
        ref={cartRef}
        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-[#1c1d24] shadow-xl transform transition-transform duration-300 ease-in-out overflow-hidden z-50"
        style={{
          animation: "slide-in-right 0.3s forwards",
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center">
              <FiShoppingBag className="text-cyan-400 mr-2" size={20} />
              <h2 className="text-xl font-bold text-white">Your Cart</h2>
              <span className="ml-2 bg-cyan-400 text-[#131419] px-2 rounded-full text-sm">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow p-6 text-center">
              <FiShoppingBag className="text-gray-500 mb-4" size={64} />
              <p className="text-gray-400 text-lg mb-2">Your cart is empty</p>
              <p className="text-gray-500 mb-6">Add some products to your cart</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-cyan-400 text-[#131419] px-6 py-2 rounded-lg font-medium hover:bg-cyan-300 transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto p-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex mb-4 bg-[#252631] p-3 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-700">
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-white">
                        <h3 className="line-clamp-1">{item.title}</h3>
                        <p className="ml-4 text-cyan-400">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-gray-600 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-l-lg transition-colors"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-3 py-1 text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-r-lg transition-colors"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 p-4">
                <div className="flex justify-between text-base font-medium text-white mb-2">
                  <p>Subtotal</p>
                  <p>${total.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-400 mb-4">Shipping and taxes calculated at checkout</p>

                <div className="space-y-3">
                  <button  onClick={handleCheckout} className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#131419] py-3 rounded-lg font-medium hover:from-cyan-400 hover:to-cyan-300 transition-all duration-300 transform hover:-translate-y-1">
                    Checkout
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full bg-gray-700 text-white py-2 rounded-lg font-medium hover:bg-gray-600 transition-all duration-300"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartSidebar

