import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const Navbar = () => {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const location = useLocation()
    
    useEffect(() => {
        const hospitalId = localStorage.getItem('hospitalId')
        setIsLoggedIn(!!hospitalId)
        
        // Listen for storage changes
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('hospitalId'))
        }
        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [location])

    const handleLogout = () => {
        localStorage.removeItem('hospitalId')
        localStorage.removeItem('hospitalName')
        setIsLoggedIn(false)
        navigate('/')
    }

    return (
        <nav className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-2xl sticky top-0 z-50 border-b-2 border-red-900">
            <div className="px-6 md:px-20 py-4 flex justify-between items-center">
                <div 
                    className="p-2 cursor-pointer group"
                    onClick={() => navigate("/")}
                >
                    <h1 className="text-2xl md:text-3xl font-black text-white group-hover:scale-110 transition-transform">
                        🩸 BloodLink
                    </h1>
                </div>
                
                <div className="flex items-center gap-3">
                    {isLoggedIn && (
                        <>
                            <button 
                                onClick={() => navigate("/hospital/dashboard")}
                                className="px-5 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg border-2 border-white/30"
                            >
                                📊 Dashboard
                            </button>
                            <button 
                                onClick={() => navigate("/hospital/update")}
                                className="px-5 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg border-2 border-white/30"
                            >
                                ⚙️ Update
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="px-5 py-2 bg-white text-red-700 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                            >
                                🚪 Logout
                            </button>
                        </>
                    )}
                    {!isLoggedIn && (
                        <>
                            <button 
                                onClick={() => navigate('/hospital/login')}
                                className="px-5 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg border-2 border-white/30"
                            >
                                🔐 Login
                            </button>
                            <button 
                                onClick={() => navigate('/hospital/register')}
                                className="px-5 py-2 bg-white text-red-700 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                            >
                                ✨ Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
