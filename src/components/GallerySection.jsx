import React from 'react';
import Gallery from './Gallery';

const GallerySection = ({ title, items }) => {
  return (
    <div className='bg-white p-5 px-20 h-23'>
      <Gallery title={title} items={items} />
    </div>
  );
};

export default GallerySection; 