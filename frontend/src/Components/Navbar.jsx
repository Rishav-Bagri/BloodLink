import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const Navbar = () => {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const location = useLocation()
    // Check if user is logged in (checking localStorage for hospitalId)
    useEffect(() => {
        const hospitalId = localStorage.getItem('hospitalId')
        
        setIsLoggedIn(!!hospitalId)
    }, [localStorage.getItem('hospitalId')])

    const handleLogout = () => {
        // Clear auth data
        localStorage.removeItem('hospitalId')
        localStorage.removeItem('hospitalName')
        // Update state and redirect
        setIsLoggedIn(false)
        navigate('/')
    }

    return (
        <div className="px-20 border py-2 flex justify-between bg-red-700 text-white">
            <div 
                className="p-2 cursor-pointer text-xl font-bold" 
                onClick={() => navigate("/")}
            >
                BloodLink
            </div>
            
            <div className="flex items-center gap-4">
                {isLoggedIn && (
                    <>
                        <button 
                            onClick={() => navigate("/hospital/dashboard")}
                            className="px-4 py-1 bg-white text-red-700 rounded-md hover:bg-gray-100"
                        >
                            Dashboard
                        </button>
                        <div onClick={()=>navigate("/hospital/update")} className="px-4 py-1 bg-white text-red-700 rounded-md hover:bg-gray-100">
                            {!!isLoggedIn?<div>Update details</div>:<div>Register</div>}
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-1 bg-white text-red-700 rounded-md hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </>
                )}
                {!isLoggedIn && location.pathname === "/hospital/dashboard"&&(
                    <>
                        <button 
                            onClick={()=>navigate('/hospital/login')}
                            className="px-4 py-1 bg-white text-red-700 rounded-md hover:bg-gray-100"
                        >
                            Login
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default Navbar