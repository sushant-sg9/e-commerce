import { useEffect, useState } from "react"
import axios from "axios"
import { FiShoppingCart, FiArrowLeft, FiSearch, FiFilter, FiX, FiChevronDown } from "react-icons/fi"
import { useCart } from "../Cart/CartContext"
import { Link } from "react-router-dom"

function SkeletonCard() {
  return (
    <div className="bg-[#1c1d24] rounded-xl overflow-hidden shadow-lg animate-pulse">
      <div className="h-48 bg-gray-700"></div>
      <div className="p-4">
        <div className="flex justify-between">
          <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-5 bg-gray-700 rounded w-1/5"></div>
        </div>
        <div className="flex space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-3 bg-gray-700 rounded-full"></div>
          ))}
          <div className="h-3 bg-gray-700 rounded w-16 ml-2"></div>
        </div>
        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
        <div className="h-8 bg-gray-700 rounded w-full mt-4"></div>
      </div>
    </div>
  )
}

function Products({ categoryId, searchQuery }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isViewingCategory, setIsViewingCategory] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const { addToCart } = useCart()
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [limit, setLimit] = useState(12)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get("https://api.escuelajs.co/api/v1/categories")
        setCategories(response.data)
      } catch (err) {
        console.error("Error fetching categories:", err)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        
        let url = "https://api.escuelajs.co/api/v1/products"
        let params = new URLSearchParams()
        
        params.append("limit", limit.toString())
        const offset = (page - 1) * limit
        if (offset > 0) params.append("offset", offset.toString())
        
        if (searchQuery) {
          params.append("title", searchQuery)
          setIsViewingCategory(false)
          setIsSearching(true)
        } 
        else if (categoryId && !selectedCategory) {
          url = `https://api.escuelajs.co/api/v1/categories/${categoryId}/products`
          setIsViewingCategory(true)
          setIsSearching(false)
        } 
        else {
          setIsViewingCategory(!!selectedCategory)
          setIsSearching(false)
          
          if (priceRange.min) params.append("price_min", priceRange.min)
          if (priceRange.max) params.append("price_max", priceRange.max)
          if (selectedCategory) params.append("categoryId", selectedCategory)
        }
        
        const queryString = params.toString()
        const finalUrl = queryString ? `${url}?${queryString}` : url
        
      
        
        const response = await axios.get(finalUrl)
        
        if (Array.isArray(response.data)) {
          setProducts(response.data)
          setTotalResults(response.data.length >= limit ? limit * 2 : response.data.length)
        } else {
          setProducts([])
          setTotalResults(0)
        }
      } catch (err) {
        console.error("Error fetching products:", err)
        setProducts([])
        setTotalResults(0)
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 600)
      }
    }

    fetchProducts()
  }, [categoryId, searchQuery, priceRange, selectedCategory, limit, page])

  function handleBackToAll() {
    setPriceRange({ min: "", max: "" })
    setSelectedCategory("")
    setPage(1)
    window.location.reload()
  }

  function handleAddToCart(product) {
    const cartProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || product.image,
      description: product.description,
    }

    addToCart(cartProduct)
  }

  function getPageTitle() {
    if (isSearching) return "Search Results"
    if (isViewingCategory) {
      const category = categories.find(cat => cat.id === parseInt(selectedCategory || categoryId))
      return category ? category.name : "Category"
    }
    return "Featured"
  }

  function handleApplyFilters(e) {
    e.preventDefault()
    setPage(1) 
  }

  function handleClearFilters() {
    setPriceRange({ min: "", max: "" })
    setSelectedCategory("")
    setPage(1)
  }

  function toggleFilters() {
    setShowFilters(!showFilters)
  }

  return (
    <div className="max-w-8xl container mx-auto relative z-10">
      <div className="bg-[#131419] p-6 md:p-10">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
            <span className="text-cyan-400">{getPageTitle()}</span> Products
            {isSearching && searchQuery && (
              <span className="ml-4 text-lg font-normal text-gray-300">
                for "<span className="text-cyan-400">{searchQuery}</span>"
              </span>
            )}
          </h1>

          <div className="flex gap-3">
            <button
              onClick={toggleFilters}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <FiFilter className="text-cyan-400" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {(isViewingCategory || isSearching || selectedCategory || priceRange.min || priceRange.max) && (
              <button
                onClick={handleBackToAll}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <FiArrowLeft />
                Back to All
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="bg-[#1c1d24] rounded-xl p-6 mb-8 shadow-lg transition-all duration-300 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FiFilter className="mr-2 text-cyan-400" /> Filter Products
              </h2>
              <button onClick={toggleFilters} className="text-gray-400 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleApplyFilters}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="block text-white font-medium">Price Range</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                      <input
                        type="number"
                        placeholder="Min"
                        className="bg-[#131419] border border-gray-700 rounded-lg p-2 pl-7 w-full text-white focus:border-cyan-400 focus:outline-none"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                        min="0"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="bg-[#131419] border border-gray-700 rounded-lg p-2 pl-7 w-full text-white focus:border-cyan-400 focus:outline-none"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-white font-medium">Category</label>
                  <div className="relative">
                    <select
                      className="bg-[#131419] border border-gray-700 rounded-lg p-2 w-full text-white appearance-none focus:border-cyan-400 focus:outline-none"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#131419] px-6 py-2 rounded-lg font-medium hover:from-cyan-400 hover:to-cyan-300 transition-all duration-300"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            {isSearching ? (
              <>
                <FiSearch className="text-cyan-400 mb-4" size={48} />
                <h3 className="text-xl text-white mb-2">No products found matching "{searchQuery}"</h3>
                <p className="text-gray-400 mb-6">Try a different search term or browse our categories</p>
              </>
            ) : (
              <>
                <FiFilter className="text-cyan-400 mb-4" size={48} />
                <h3 className="text-xl text-white mb-2">No products found with these filters</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or browse all products</p>
              </>
            )}
            <button
              onClick={handleClearFilters}
              className="bg-cyan-400 text-[#131419] px-6 py-2 rounded-lg font-medium hover:bg-cyan-300 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id || index}
                  className="bg-[#1c1d24] rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden group h-48">
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131419] to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-cyan-400 text-[#131419] p-2 rounded-full hover:bg-cyan-300 transition-colors"
                      >
                        <FiShoppingCart size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                     
                      <h3 className="text-white font-semibold text-lg line-clamp-1">{product.title}</h3>
                      <span className="text-cyan-400 font-bold">${product.price?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="text-gray-300 text-sm line-clamp-2 mb-3">
                      {product.description?.substring(0, 80) || "No description available"}
                      ...
                    </div>
                    <div className="flex justify-end">
                    <Link to={`/product/${product.id}`} className="text-cyan-400 hover:text-cyan-300 text-sm hover:underline transition-colors">
                        View Details
                      </Link>
                      </div>
                  </div>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#131419] py-2 rounded-lg font-medium hover:from-cyan-400 hover:to-cyan-300 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {totalResults >= limit && (
              <div className="flex justify-center items-center mt-10">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-l-lg ${
                    page === 1 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>
                <div className="bg-[#1c1d24] px-4 py-2 text-white font-medium">
                  Page {page}
                </div>
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={products.length < limit}
                  className={`px-4 py-2 rounded-r-lg ${
                    products.length < limit
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Products