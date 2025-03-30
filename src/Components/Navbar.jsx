import { useEffect, useRef, useState } from "react"
import { FaShoppingCart, FaSearch, FaBars, FaTimes, FaUser } from "react-icons/fa"
import { useAuth } from "../Context/AuthContext"
import { useCart } from "../Cart/CartContext"
import UserMenu from "./UserMenu"

const Navbar = ({ onSearch, onClearSearch, searchQuery }) => {
  const { user, loginWithGoogle, logout } = useAuth()
  const { getCartCount, toggleCart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const searchInputRef = useRef(null)
  const searchTimeoutRef = useRef(null)
  const cartCount = getCartCount()

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Shop", href: "#" },
    { name: "Categories", href: "#" },
  ]

  const toggleSearch = () => {
    if (isSearchOpen && inputValue) {
      setInputValue("")
      onClearSearch()
    }
    setIsSearchOpen(!isSearchOpen)
  }

  const handleSearchInput = (e) => {
    const value = e.target.value
    setInputValue(value)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (value.trim().length > 0) {
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(value)
      }, 500)
    } else if (value === "") {
      onClearSearch()
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSearch(inputValue)
    }
  }

  const handleClearSearch = () => {
    setInputValue("")
    onClearSearch()
  }

  const handleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <nav className="relative bg-[#131419] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <h1
              className="text-3xl font-bold text-white 
              transform transition-all duration-300 
              hover:text-cyan-400 
              hover:tracking-wider 
              cursor-pointer"
            >
              ShopNow
            </h1>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white px-3 py-2 rounded-lg text-sm font-medium 
                    transition-all duration-300 
                    hover:bg-gray-800 
                    hover:text-cyan-400
                    transform hover:scale-105
                    relative
                    overflow-hidden
                    group"
                >
                  <span className="relative z-10">{item.name}</span>
                  <span
                    className="absolute bottom-0 left-0 w-full h-1 
                      bg-cyan-400 
                      transform -translate-x-full 
                      group-hover:translate-x-0 
                      transition-transform duration-300"
                  ></span>
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 relative">
            <div className="relative flex items-center">
              <form
                onSubmit={handleSearchSubmit}
                className={`
                  absolute right-0 top-1/2 -translate-y-1/2 
                  transition-all duration-500 ease-in-out
                  ${isSearchOpen ? "opacity-100 translate-x-0 w-64" : "opacity-0 translate-x-10 w-0"}
                `}
              >
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleSearchInput}
                    placeholder="Search products..."
                    className={`
                      w-full px-4 py-2 pr-10 rounded-full 
                      bg-gray-800 text-white 
                      focus:outline-none focus:ring-2 focus:ring-cyan-400
                      transition-all duration-300
                    `}
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <FaTimes size={16} />
                    </button>
                  )}
                </div>
              </form>
              <button
                onClick={toggleSearch}
                className="text-white hover:text-cyan-400 
                  transform transition-all duration-300 
                  hover:scale-105 cursor-pointer z-10 px-2"
              >
                {isSearchOpen ? <FaTimes size={24} /> : <FaSearch size={24} />}
              </button>
            </div>

            <div className="relative group">
              <button onClick={toggleCart} className="flex items-center justify-center">
                <FaShoppingCart
                  className="text-white hover:text-cyan-400 
                    transform transition-all duration-300 
                    hover:scale-125 cursor-pointer"
                  size={24}
                />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-cyan-400 text-[#131419] 
                    rounded-full w-5 h-5 flex items-center justify-center 
                    text-xs font-bold"
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={handleLogin}
                className="
                px-6 py-2 
                bg-gradient-to-r from-cyan-500 to-blue-500 
                text-white 
                font-semibold 
                rounded-full 
                shadow-lg 
                transform 
                transition-all 
                duration-300 
                hover:scale-105 
                relative 
                overflow-hidden 
                cursor-pointer"
              >
                Login
              </button>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 
                rounded-md text-white hover:bg-gray-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-offset-gray-800 focus:ring-white"
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden animate-slide-in-right">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#1a1b1e]">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white block px-3 py-2 rounded-md text-base font-medium 
                  hover:bg-gray-800 hover:text-cyan-400 
                  transition-all duration-300"
              >
                {item.name}
              </a>
            ))}

            <div className="px-3 py-2">
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-800 rounded-full p-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleSearchInput}
                  placeholder="Search products..."
                  className="w-full bg-transparent text-white 
                    focus:outline-none placeholder-gray-400 px-2"
                />
                {inputValue ? (
                  <button type="button" onClick={handleClearSearch} className="text-gray-400 hover:text-white p-1">
                    <FaTimes size={20} />
                  </button>
                ) : (
                  <button type="submit" className="text-white p-1">
                    <FaSearch size={20} />
                  </button>
                )}
              </form>
            </div>

            <div className="flex justify-around pt-4 border-t border-gray-800">
              <button onClick={toggleCart} className="relative">
                <FaShoppingCart className="text-white hover:text-cyan-400" size={24} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-cyan-400 text-[#131419] 
                    rounded-full w-5 h-5 flex items-center justify-center 
                    text-xs font-bold"
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  ) : (
                    <FaUser className="text-white hover:text-cyan-400 mr-2" size={24} />
                  )}
                  <button onClick={logout} className="text-white hover:text-cyan-400">
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={handleLogin} className="text-white hover:text-cyan-400">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

