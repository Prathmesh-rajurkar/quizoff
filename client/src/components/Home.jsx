import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

export default function QuizzOffLanding() {
  return (
    <div className="h-screen bg-black text-white box-border">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto my-36">
        <div className='my-10'>
          <h1 className='text-center text-4xl font-semibold my-2'>Host a Quiz to energize your audience</h1>
          <h3 className='text-center text-2xl font-semibold my-2'>with</h3>
          <h1 className='text-center text-6xl font-bold text-purple-600'>QuizzOff</h1>
        </div>
        <div className='flex items-center justify-center gap-10 my-10'>
          <button className='px-5 py-3 bg-purple-600 rounded-xl font-semibold cursor-pointer active:scale-95 transition-transform hover:bg-purple-500'>
            Create Quiz
          </button>
          <Link to={'/join'}>
            <button className='px-5 py-3 text-purple-600 border-2 border-purple-600 rounded-xl font-semibold cursor-pointer active:scale-95 transition-all duration-300  hover:bg-purple-600 hover:text-white'>
              Join Quiz
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}