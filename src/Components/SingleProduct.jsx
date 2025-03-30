import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { FiArrowLeft, FiShoppingCart, FiStar, FiTruck, FiShield, FiCreditCard, FiPackage } from "react-icons/fi"
import { useCart } from "../Cart/CartContext"
import Navbar from "./Navbar"
import CartSidebar from "../Cart/CartSidebar"

function SingleProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const response = await axios.get(`https://api.escuelajs.co/api/v1/products/${id}`)
        setProduct(response.data)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = () => {
    if (!product) return

    const cartProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || "",
      description: product.description,
      quantity: quantity
    }

    addToCart(cartProduct)
    setAddedToCart(true)
    
    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, quantity + value)
    setQuantity(newQuantity)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131419] flex items-center justify-center">
        <div className="animate-pulse text-cyan-400 text-2xl">Loading product...</div>
      </div>
    )
  }


  return (
    <>
    <Navbar/>
    <CartSidebar/>
    <div className="min-h-screen bg-[#131419] text-white pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={handleGoBack}
          className="flex items-center mb-6 text-gray-300 hover:text-cyan-400 transition-all duration-300"
        >
          <FiArrowLeft className="mr-2" /> Back to Shop
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-2xl group">
              <img 
                src={product.images[currentImage]} 
                alt={product.title} 
                className="w-full h-[500px] object-cover object-center transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto py-2">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`
                    relative w-24 h-24 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden
                    transition-all duration-300 transform
                    ${currentImage === index ? 'ring-2 ring-cyan-400 scale-105' : 'hover:scale-105'}
                  `}
                >
                  <img 
                    src={image} 
                    alt={`${product.title} - view ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-cyan-400/20 text-cyan-400">
                  {product.category.name}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">{product.title}</h1>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">In Stock</span>
              </div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-cyan-400">${product.price.toFixed(2)}</div>
              <p className="text-sm text-gray-400 mt-1">Free shipping on orders over $50</p>
            </div>
            
            <div className="border-t border-b border-gray-800 py-6">
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-gray-300 mr-4">Quantity:</span>
                <div className="flex items-center border border-gray-700 rounded-full overflow-hidden">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-[40px] text-center">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`
                  w-full px-6 py-3 rounded-full font-semibold
                  flex items-center justify-center
                  shadow-lg transform transition-all duration-300
                  ${addedToCart 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-105'
                  }
                `}
              >
                <FiShoppingCart className="mr-2" />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-start space-x-3">
                <FiTruck className="text-cyan-400 mt-1" />
                <div>
                  <h4 className="font-medium">Free Shipping</h4>
                  <p className="text-sm text-gray-400">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiPackage className="text-cyan-400 mt-1" />
                <div>
                  <h4 className="font-medium">Easy Returns</h4>
                  <p className="text-sm text-gray-400">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiShield className="text-cyan-400 mt-1" />
                <div>
                  <h4 className="font-medium">Secure Checkout</h4>
                  <p className="text-sm text-gray-400">Encrypted payment</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiCreditCard className="text-cyan-400 mt-1" />
                <div>
                  <h4 className="font-medium">Flexible Payment</h4>
                  <p className="text-sm text-gray-400">Pay with multiple cards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default SingleProduct