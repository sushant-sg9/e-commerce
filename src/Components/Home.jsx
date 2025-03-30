import { useState } from "react"
import Navbar from "./Navbar"
import Categories from "./Categories"
import Products from "./Products"
import CartSidebar from "../Cart/CartSidebar"
import { CartProvider } from "../Cart/CartContext"

const Home = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId)
    setSearchQuery("") 
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setSelectedCategoryId(null)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="bg-[#131419]">
      <Navbar onSearch={handleSearch} onClearSearch={handleClearSearch} searchQuery={searchQuery} />
      <Categories onSelectCategory={handleCategorySelect} />
      <Products categoryId={selectedCategoryId} searchQuery={searchQuery} />
      <CartSidebar />
    </div>
  )
}

export default Home

