import { useState } from 'react'
import { Link, Routes, Route, useLocation } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import About from './about.jsx'
import Navbar from './navbar.jsx';

function App() {
  const location = useLocation();

  return (
    <>
    <Navbar />
    <div className="relative">
      <img 
        src="https://amity.edu/images/university.jpg" 
        alt="homebg" 
        className='w-full h-5/6'
      />   
      <div className="absolute inset-0 bg-black/65"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full font-montserrat">
        <h1 className="text-white text-5xl font-bold mb-4">
          Student Centric Accommodation Platform
        </h1>
        <p className="text-white text-2xl">
          affordable & comfortable living, just steps away from campus!
        </p>
        <div className="relative w-2/4 mx-auto mt-8">
          <input 
            type="text"
            placeholder="Search for you desired college, location or PG"
            className="w-full px-6 py-4 bg-white rounded-full text-gray-800 focus:outline-none font-montserrat"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FE6F61] hover:bg-[#e3837a] p-3 rounded-full cursor-pointer">
            <svg 
              className="w-6 h-6 text-white"
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>
      </div>
      
      {/* overlapping divs */}
      <div className="absolute bottom-0 w-full px-20 translate-y-1/2">
        <div className="grid grid-cols-3 gap-20">
          <div className="bg-white rounded-3xl shadow-lg p-2.5 h-33">
            <div className='bg-white rounded-3xl h-24 border-gray-300 border-[1.5px] flex'>
              <div className="w-1/3 h-full">
                <img 
                  src="https://amity.edu/images/university.jpg" 
                  alt="Feature 1"
                  className="w-full h-full object-cover rounded-l-3xl border-[1.5px] border-gray-300"
                />
              </div>
              <div className="w-2/3 p-4">
                <h3 className="text-lg font-bold text-gray-800">Feature Title</h3>
                <p className="text-sm text-gray-600">Brief description of the feature goes here</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-lg p-2.5 h-33">
            <div className='bg-white rounded-3xl h-24 border-gray-300 border-[1.5px] flex'>
              <div className="w-1/3 h-full">
                <img 
                  src="https://amity.edu/images/university.jpg" 
                  alt="Feature 2"
                  className="w-full h-full object-cover rounded-l-3xl border-[1.5px] border-gray-300"
                />
              </div>
              <div className="w-2/3 p-4">
                <h3 className="text-lg font-bold text-gray-800">Feature Title</h3>
                <p className="text-sm text-gray-600">Brief description of the feature goes here</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-lg p-2.5 h-33">
            <div className='bg-white rounded-3xl h-24 border-gray-300 border-[1.5px] flex'>
              <div className="w-1/3 h-full">
                <img 
                  src="https://amity.edu/images/university.jpg" 
                  alt="Feature 3"
                  className="w-full h-full object-cover rounded-l-3xl border-[1.5px] border-gray-300"
                />
              </div>
              <div className="w-2/3 p-4">
                <h3 className="text-lg font-bold text-gray-800">Feature Title</h3>
                <p className="text-sm text-gray-600">Brief description of the feature goes here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Add margin bottom to account for overlapping cards */}
    <div className="mb-32"></div>
    
      {/* <nav>
        <Link to={location.pathname === "/" ? "/about" : "/"}>
          <button className='text-1xl bold text-white border-2 border-white mb-2'>
            {location.pathname === "/" ? "Go to About" : "Go to Home"}
          </button>
        </Link>
      </nav>
      
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
      </Routes> */}
    </>
  )
}

// Simple component for Home page
function Home() {
  return <h1>Home Page</h1>
}


export default App
