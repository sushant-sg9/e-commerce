import React, { useState, useEffect } from "react"
import axios from "axios"

const Categories = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://api.escuelajs.co/api/v1/categories")
        setCategories(response.data)
      } catch (err) {
        console.error("Error fetching categories:", err)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id)
    onSelectCategory(category.id)
  }

  return (
    <div className="py-6 bg-[#131419] text-white">
      <div className="max-w-8xl container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight">
            <span className="inline-block border-b-2 border-cyan-400 pb-1">Shop by Category</span>
          </h2>
        </div>

        <div className="relative overflow-x-auto hide-scrollbar">
          <div className="flex space-x-3 pb-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-shrink-0 w-28 sm:w-36 group cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <div
                  className={`relative overflow-hidden rounded-lg bg-gray-800 shadow-md transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl ${selectedCategory === category.id ? "ring-2 ring-cyan-400" : ""}`}
                >
                  <div className="h-24 sm:h-32 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-2 text-center relative">
                    <h3
                      className={`text-sm font-medium truncate ${selectedCategory === category.id ? "text-cyan-400" : "group-hover:text-cyan-400"} transition-colors duration-300`}
                    >
                      {category.name}
                    </h3>
                    <div
                      className={`h-0.5 bg-cyan-400 mx-auto transition-all duration-300 mt-1 ${selectedCategory === category.id ? "w-1/2" : "w-0 group-hover:w-1/2"}`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories

