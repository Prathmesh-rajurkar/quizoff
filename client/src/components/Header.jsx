import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="border-b border-gray-800 h-[10%] bg-[#20002c]">
            <div className="flex items-center justify-between md:px-20 px-10 py-4 ">
                <Link to="/">
                    <h1 className="text-purple-600 text-4xl font-semibold text-center cursor-pointer">
                        Quizzy
                    </h1>
                </Link>
                <div className="flex items-center justify-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <Link to={"/dashboard"}>
                                <button className="py-2 px-4 rounded-xl text-purple-600 font-semibold cursor-pointer hover:bg-gray-100/5 ">
                                    Dashboard
                                </button>
                            </Link>
                            <span className="text-purple-400">{user?.username || user?.email}</span>
                            <button 
                                onClick={handleLogout}
                                className="py-2 px-4 rounded-xl bg-red-600 font-semibold cursor-pointer hover:bg-red-500"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to={"/login"}>
                                <button className="py-2 px-4 rounded-xl text-purple-600 font-semibold cursor-pointer hover:bg-gray-100/5 ">
                                    Log In
                                </button>
                            </Link>
                            <Link to={"/register"}>
                                <button className="py-2 px-4 rounded-xl bg-purple-600 font-semibold cursor-pointer hover:bg-purple-500">
                                    Sign Up
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header