import React from 'react';
import './Gallery.css';

const Gallery = ({ title, items }) => {
  return (
    <div className="bg-[#FE6F61] p-5 rounded-3xl">
      <h2 className="text-white text-3xl font-bold text-center mb-4">{title}</h2>
      <div className="gallery-container">
        {items.map((item, index) => (
          <div key={index} className="gallery-item bg-white rounded-lg shadow-lg m-2 overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
            <div className="p-2 text-center">
              <h3 className="font-bold bg-[#FE6F61] text-white rounded-lg py-2">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Gallery; 