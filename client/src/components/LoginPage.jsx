import React from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form refresh
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="h-screen bg-[#20002c] text-white box-border font-sans">

      {/* Login Form */}
      <main className="max-w-6xl mx-auto flex justify-center items-center h-[80%] px-4 my-auto">
        <div className="w-full max-w-sm bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-sm">
          <h2 className="text-3xl font-semibold text-center text-purple-600 mb-6">
            LogIn to Quizzy
          </h2>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username/Email"
              className="p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
              required
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-95"
            >
              Log In
            </button>
            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </main>

    </div>
  );
};

export default LoginPage;