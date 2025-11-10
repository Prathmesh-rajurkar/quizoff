import React from 'react';

export default function QuizzOffLanding() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-purple-400 text-4xl font-semibold text-center">Quizzoff</h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16 h-5/6">
          <h2 className="text-5xl font-bold mb-6">
            Ignite Your Knowledge, Challenge Your Friends!
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            QuizzOff is your ultimate platform for creating and joining engaging quizzes. Test your knowledge, challenge friends, and discover new facts!
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors active:scale-95 cursor-pointer">
              Create Quiz
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors active:scale-95 cursor-pointer">
              Join Quiz
            </button>
          </div>
        </div>

        {/* Steps Section */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4">
            Get Started in 3 Easy Steps
          </h3>
          <p className="text-gray-400 text-center mb-12">
            Jump into the action quickly and effortlessly
          </p>

          {/* Step Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-bold mb-3">Create or Join</h4>
              <p className="text-gray-400 text-sm">
                Easily start a new quiz or join an active quiz in just one click.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-bold mb-3">Play & Compete</h4>
              <p className="text-gray-400 text-sm">
                Answer fun, challenging questions, and compete for the top spot.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-bold mb-3">See Results</h4>
              <p className="text-gray-400 text-sm">
                View the leaderboard and celebrate your success!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
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