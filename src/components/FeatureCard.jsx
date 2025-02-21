import React from 'react';

const FeatureCard = ({ feature }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-2.5 h-33">
      <div className='bg-white rounded-3xl h-24 border-gray-300 border-[1.5px] flex'>
        <div className="w-1/3 h-full">
          <img 
            src={feature.image} 
            alt={feature.title}
            className="w-full h-full object-cover rounded-l-3xl border-[1.5px] border-gray-300"
          />
        </div>
        <div className="w-2/3 p-4">
          <h3 className="text-lg font-bold text-gray-800">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard; 