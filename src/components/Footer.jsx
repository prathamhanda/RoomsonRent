import React from 'react'

const Footer = () => {
  return (
    <div className='bg-[#FE6F61] flex p-5 w-full h-[220px]'>
      <div className='w-1/3  border-r-2 border-white text-5xl font-montserrat text-white flex justify-center items-center font-bold'>ROR</div>
      <div className='w-1/3  border-r-2 border-white font-montserrat text-white flex flex-col justify-center items-center'>
      <h1 className='text-white text-3xl font-bold mb-3 uppercase'>Contact Us!</h1>
      <a href="tel:+916207409628" className='text-lg'>+91 62074 09628</a>
      <a href="mailto:officialroomsonrent@gmail.com" className='text-lg'>officialroomsonrent@gmail.com</a>
      </div>
      <div className='w-1/3 text-5xl font-montserrat text-white flex flex-col justify-center items-center'>
      <h1 className='text-white text-3xl font-bold mb-3 uppercase'>Follow Us!</h1>

      <div className='flex space-x-4'>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
        <img src="https://img.icons8.com/?size=100&id=98960&format=png&color=FFFFFF" alt="twitter link" className='h-8' />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <img src="https://img.icons8.com/?size=100&id=fJp7hepMryiw&format=png&color=FFFFFF" alt="twitter link" className='h-8' />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
        <img src="https://img.icons8.com/?size=100&id=32292&format=png&color=FFFFFF" alt="instagram link" className='h-8' />
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
        <img src="https://img.icons8.com/?size=100&id=118466&format=png&color=FFFFFF" alt="facebook link" className='h-8' />
        </a>
      </div>
      </div>
    </div>
  )
}

export default Footer
