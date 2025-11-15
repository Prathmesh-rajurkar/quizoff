import React from 'react'

const Header = () => {
    return (
        <header className="border-b border-gray-800 h-[10%]">
            <div className="flex items-center justify-between md:px-20 px-10 py-4 ">
                <h1 className="text-purple-600 text-4xl font-semibold text-center">
                    Quizzy
                </h1>
                <div className="flex items-center justify-center gap-3">
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
                </div>
            </div>
        </header>
    )
}

export default Header