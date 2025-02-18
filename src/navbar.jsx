import React from 'react'

const Navbar = () => {
  return (
    <div className='fixed w-full z-50 flex justify-between items-center px-14 py-8'>
      <button className='relative px-4 py-2 rounded-md text-3xl font-montserrat font-bold text-white'>
        <span className='relative z-10'>Rooms on Rent</span>
      </button>
      <div className='flex items-center text-lg gap-8'>
        <a href="/" className='text-white hover:text-gray-300 font-montserrat transition-colors flex items-center gap-2'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
          </svg>
          Support
        </a>
        <a href="/" className='text-white hover:text-gray-300 font-montserrat transition-colors flex items-center gap-2'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          Wishlist
        </a>
        <button className='px-4 py-2 text-white bg-[#FE6F61] font-bold rounded-3xl font-montserrat hover:bg-[#e87c73] hover:shadow-lg transition-colors'>Login/Sign Up</button>
      </div>
    </div>
  )
}

export default Navbar
