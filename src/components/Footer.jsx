import React from 'react';

const Footer = () => {
  return (
    <div className='bg-[#FE6F61] w-full'>
      <div className='flex flex-col md:flex-row'>
        {/* Logo Section */}
        <div className='w-full md:w-1/3 py-8 md:border-r-2 md:border-white text-4xl md:text-5xl font-montserrat text-white flex justify-center items-center font-bold'>
          ROR
        </div>
        
        {/* Contact Section */}
        <div className='w-full md:w-1/3 py-8 md:border-r-2 md:border-white font-montserrat text-white flex flex-col justify-center items-center'>
          <h1 className='text-white text-2xl md:text-3xl font-bold mb-3 uppercase'>Contact Us!</h1>
          <a href="tel:+916207409628" className='text-base md:text-lg mb-1'>+91 62074 09628</a>
          <a href="mailto:officialroomsonrent@gmail.com" className='text-base md:text-lg text-center px-4'>officialroomsonrent@gmail.com</a>
        </div>
        
        {/* Social Media Section */}
        <div className='w-full md:w-1/3 py-8 font-montserrat text-white flex flex-col justify-center items-center'>
          <h1 className='text-white text-2xl md:text-3xl font-bold mb-3 uppercase'>Follow Us!</h1>
          <div className='flex space-x-4'>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/?size=100&id=98960&format=png&color=FFFFFF" alt="linkedin link" className='h-6 md:h-8' />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/?size=100&id=fJp7hepMryiw&format=png&color=FFFFFF" alt="twitter link" className='h-6 md:h-8' />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/?size=100&id=32292&format=png&color=FFFFFF" alt="instagram link" className='h-6 md:h-8' />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/?size=100&id=118466&format=png&color=FFFFFF" alt="facebook link" className='h-6 md:h-8' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;