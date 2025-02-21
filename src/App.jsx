import { useState } from 'react'
import { Link, Routes, Route, useLocation } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Navbar from './navbar.jsx';
import Carousel from './components/Carousel';
import FeatureCard from './components/FeatureCard';
import GallerySection from './components/GallerySection';
import Footer from './components/Footer.jsx';

// Add this sample data
const carouselItems = [
  {
    title: "Card 1",
    description: "Description for card 1"
  },
  {
    title: "Card 2",
    description: "Description for card 2"
  },
  {
    title: "Card 3",
    description: "Description for card 3"
  },
  {
    title: "Card 4",
    description: "Description for card 4"
  },
  {
    title: "Card 5",
    description: "Description for card 5"
  }
];

function App() {
  const location = useLocation();
  
  // Add new carousel data
  const bottomCarouselItems = [
    {
      title: "Featured PG 1",
      description: "Luxury PG accommodation near campus"
    },
    {
      title: "Featured PG 2",
      description: "Budget-friendly student housing"
    },
    {
      title: "Featured PG 3",
      description: "Premium student apartments"
    }
  ];

  const galleryItems = [
    { image: 'url_to_image_1', title: 'Kamal Nagar' },
    { image: 'url_to_image_2', title: 'Kalyan Vihar' },
    { image: 'url_to_image_3', title: 'Roop Nagar' },
    { image: 'url_to_image_4', title: 'Ghanta Ghar' },
    { image: 'url_to_image_5', title: 'Shakti Nagar' },
  ];

  const featureData = [
    {
      image: "https://amity.edu/images/university.jpg",
      title: "Feature Title",
      description: "Brief description of the feature goes here"
    },
    {
      image: "https://amity.edu/images/university.jpg",
      title: "Feature Title",
      description: "Brief description of the feature goes here"
    },
    {
      image: "https://amity.edu/images/university.jpg",
      title: "Feature Title",
      description: "Brief description of the feature goes here"
    }
    // Add more features as needed
  ];

  return (
    <>
    <Navbar />
    <div className="relative">
      <img 
        src="https://s3-alpha-sig.figma.com/img/56b0/ed61/47d156d39faad32eb98b6ce7f9110a0b?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ss~IppWo~DZLW8EdD3mx4-yUDw-1wJEP6RchqXHas~A-kMS6~kQLzBplW1q59zJX~Gf5rKrwssnvbQCo~CjQ-6jUhqhBaR3rw2-Q1tYMltGGGEcSK4-0I0~toRvfSenyA~0J66Hmz86~kL3AGwD7SVilCJCK7vPXzG-5C7qAX9eMd79xXejj60gHXj9nbnK6G3-yOu9HP-~4lRybMv5wlRoiVSHp2JczrSml62rwlU21njI6UkB~vL6rHETZ3bfefdPM612B56bG-buY~o~ihcK-~~-JqR42ki~JyvMlJc-WvAKXzyAEivGONPxeHBSd~HVhKGT2Kpi0cHRceiakzQ__" 
        alt="homebg" 
        className='w-full h-[650px] object-cover'
      />   
      <div className="absolute inset-0 bg-black/65"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full font-montserrat">
        <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
          Student Centric Accommodation Platform
        </h1>
        <p className="text-white text-lg md:text-2xl">
          affordable & comfortable living, just steps away from campus!
        </p>
        <div className="relative w-3/4 mx-auto mt-8">
          <input 
            type="text"
            placeholder="Search for your desired college, location or PG"
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
      <div className="absolute bottom-0 w-full px-5 md:px-20 translate-y-1/2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featureData.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </div>
    {/* Add margin bottom to account for overlapping cards */}
    <div className="mb-20"></div>
    <h1 className='text-black px-5 md:px-20 py-5 text-3xl md:text-4xl font-montserrat font-bold tracking-wide'>Your <span className='text-[#FE6F61]'>Perfect</span> Accomodation</h1>
    <Carousel items={carouselItems} />
    
    {/* New gradient div with carousel */}
    <div className="mx-5 md:mx-20 my-7 rounded-xl border-2 border-[#AE8549] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#AE8549]/20 to-white/0 pointer-events-none" />
      <div className="p-4 pl-2">
        <h2 className="text-2xl md:text-3xl font-montserrat font-bold mb-6 text-[#AE8549] tracking-wide flex items-center gap-2 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="#AE8549" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          Premium Accommodation Show-Off
        </h2>
        <Carousel items={bottomCarouselItems} />
      </div>
    </div>

    <h1 className='text-black px-5 md:px-20 py-5 text-3xl md:text-4xl font-montserrat font-bold tracking-wide'><span className='text-[#FE6F61]'>Short</span> Stays</h1>
    <Carousel items={bottomCarouselItems}/>
    
    <h1 className='text-black px-5 md:px-20 py-5 text-3xl md:text-4xl font-montserrat font-bold tracking-wide'>Flatmate <span className='text-[#FE6F61]'>Needed</span></h1>
    <Carousel items={bottomCarouselItems}/>

    {/* Our Services Section */}
    <h1 className='text-black px-5 md:px-20 py-5 text-3xl md:text-4xl font-montserrat font-bold tracking-wide'>Our <span className='text-[#FE6F61]'>Services</span></h1>
    <div className="bg-gray-50 py-8 shadow-sm">
      <div className="flex flex-wrap justify-around gap-4 px-5 md:px-20">
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-300 text-center w-full sm:w-1/5">
          <div className="bg-[#FE6F61] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-black mb-1">One Click Booking</h3>
          <p className="text-sm text-gray-600">Book your perfect student accommodation instantly</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-300 text-center w-full sm:w-1/5">
          <div className="bg-[#FE6F61] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-black mb-1">Lowest Price Guaranteed</h3>
          <p className="text-sm text-gray-600">Find a lower price and we will match it. No questions asked</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl border border-gray-300 p-6 text-center w-full sm:w-1/5">
          <div className="bg-[#FE6F61] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-black mb-1">24/7 Customer Support</h3>
          <p className="text-sm text-gray-600">Each and every query will be answered instantly</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl border border-gray-300 p-6 text-center w-full sm:w-1/5">
          <div className="bg-[#FE6F61] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-black mb-1">100% Verified Properties</h3>
          <p className="text-sm text-gray-600">We only list the properties after proper research</p>
        </div>
      </div>
    </div>

    <h1 className='text-black px-5 md:px-20 py-1 text-3xl md:text-4xl font-montserrat font-bold tracking-wide'>Popular areas for<span className='text-[#FE6F61]'> students </span>in Delhi</h1>

    <h1 className='text-[#979797] px-5 md:px-20 text-[16px] tracking-wide font-semibold font-montserrat'>Book student accommodations near universities around Delhi</h1>

    {/* Gallery Section */}
    <GallerySection title="North Campus" items={galleryItems} />
    <GallerySection title="South Campus" items={galleryItems} />
    <GallerySection title="Off Campus" items={galleryItems} />

    <Footer />
    </>
  )
}

export default App