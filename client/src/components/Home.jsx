import React from 'react';

export default function QuizzOffLanding() {
  return (
    <div className="h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 h-[10%]">
        <div className="flex items-center justify-between px-20 py-4 ">
          <h1 className="text-purple-600 text-4xl font-semibold text-center">Quizzoff</h1>
          <div>
            <button className='py-2 px-4 rounded-xl text-purple-600 font-semibold'>Log In</button>
            <button className='py-2 px-4 rounded-xl bg-purple-600 font-semibold'>Sign Up</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto">
        <div className='my-10'>
          <h1 className='text-center text-4xl font-semibold my-2'>Host a quiz to energize your audience</h1>
          <h3 className='text-center text-2xl font-semibold my-2'>With</h3>
          <h1 className='text-center text-6xl font-bold text-purple-600'>QuizzOff</h1>
        </div>
        <div className='flex items-center justify-center gap-10 my-10'>
          <button className='px-5 py-3 bg-purple-600 rounded-xl font-semibold cursor-pointer active:scale-95 transition-transform'>
              Create Quiz
          </button>
          <button className='px-5 py-3 text-purple-600 border-2 border-purple-600 rounded-xl font-semibold cursor-pointer active:scale-95 transition-all duration-300  hover:bg-purple-600 hover:text-white'>
              Join Quiz
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 h-[10%]">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center text-gray-400 text-sm space-y-2">
            <p>© 2025 QuizzOff. All rights reserved</p>
            <div className="flex justify-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}