import { useRef } from 'react';
import './Carousel.css';

const Carousel = ({ items }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const container = carouselRef.current;
    const scrollAmount = container.offsetWidth * 0.4; // Scroll by 40% of container width
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className='flex items-center justify-center px-24'>
      <div className="carousel-container">
        <button 
          className="carousel-button left" 
          onClick={() => scroll('left')}
        >
          &lt;
        </button>
        
        <div className="carousel-items" ref={carouselRef}>
          {items.map((item, index) => (
            <div className="carousel-card" key={index}>
              <div className="accommodation-card bg-white rounded-lg overflow-hidden border border-gray-100">
                <div className="flex flex-row">
                  {/* Left side - Image */}
                  <div className="w-2/5 h-48">
                    <img 
                      src={item.image || "https://images.trvl-media.com/lodging/23000000/22410000/22408200/22408101/b1d9ae65.jpg"} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Right side - Content */}
                  <div className="w-3/5 text-black p-4">
                    <h3 className="text-lg font-bold mb-1">{item.title || "Micheal Jackson 1st Floor R2"}</h3>
                    <p className="text-sm text-gray-500 mb-3">{item.location || "Vasant Vihar, South Delhi"}</p>
                    
                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.amenities ? (
                        item.amenities.map((amenity, i) => (
                          <div key={i} className="flex items-center">
                            <div className={`w-6 h-6 rounded-full ${amenity.color || "bg-green-500"} flex items-center justify-center mr-2`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-sm">{amenity.name}</span>
                          </div>
                        ))
                      ) : (
                        <>
                          {item.ac !== false && (
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-sm">A/C</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-sm">WiFi</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-sm">{item.occupancy || "Single Occupancy"}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Stay Type */}
                    {(item.stayType || item.stayType === "Short Stay") && (
                      <div className="mb-3">
                        <span className="text-xs text-red-500 border border-red-500 rounded-full px-3 py-1">
                          Short Stay
                        </span>
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="mt-3">
                      <p className="text-lg font-bold mb-3">
                        Rs. {item.price || "7,000/-"} <span className="text-sm font-normal">per month</span>
                      </p>
                      
                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button className="bg-[#FF6B5B] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e3625a] w-full">
                          Book Now
                        </button>
                        <button className="border border-[#FF6B5B] text-[#FF6B5B] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 w-full">
                          Site Visit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="carousel-button right" 
          onClick={() => scroll('right')}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Carousel;