import React from 'react'
import { Camera, ChartPie, Home, LibraryBig } from 'lucide-react';

const sidebarNav = [{
  name: "Home",
  link: "dashboard/",
  icon: Home
}, {
  name: "Library",
  link: "dashboard/library",
  icon: LibraryBig
}, {
  name: "Sessions",
  link: "dashboard/sessions",
  icon: ChartPie
}
]
const Dashboard = () => {
  return (
    <div className="h-screen bg-[#20002c] text-white box-border">
      <div className='flex '>
        <div className='h-screen border '>
          <div className='border-b p-4'>
            <h1 className='text-3xl'>Quizzy</h1>
          </div>
          <div className='flex flex-col items-center justify-between mt-10'>
            {sidebarNav.map((nav) => {
              const Icon = nav.icon;
              return (
                <a href={nav.link} className='flex flex-col items-center justify-between mb-5'>
                  <Icon />
                  {nav.name}
                </a>
              )
            }
            )}
          </div>


          <div>
            <div>
              
            </div>
            <div className='flex items-center justify-around'>
              <div className='rounded-full bg-red-600 text-white w-10 h-10 text-center text-2xl'>P</div>
              <h3>Prathmesh</h3>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default Dashboard