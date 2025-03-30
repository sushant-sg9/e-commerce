import { useState, useRef, useEffect } from "react"
import { FaUser } from "react-icons/fa"
import { useAuth } from "../Context/AuthContext"

const UserMenu = () => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-2 border-2 border-cyan-400"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-2 border-2 border-cyan-400">
            <FaUser className="text-white" />
          </div>
        )}
        <span className="text-white hover:text-cyan-400 transition-colors duration-300">
          {user?.displayName?.split(" ")[0] || "User"}
        </span>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 animate-fade-in">
          <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
            Signed in as
            <br />
            <span className="font-medium text-white">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu

