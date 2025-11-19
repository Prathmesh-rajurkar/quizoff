import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 h-[10%] bg-[#20002c]">
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
  )
}

export default Footer