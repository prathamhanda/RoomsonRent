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
    <div className='flex items-center justify-center'>
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
              <div className="accommodation-card bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row">
                  {/* Left side - Image */}
                  <div className="w-full md:w-2/5 h-48 md:h-auto">
                    <img 
                      src={item.image || "https://images.trvl-media.com/lodging/23000000/22410000/22408200/22408101/b1d9ae65.jpg"} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Right side - Content */}
                  <div className="w-full md:w-3/5 text-black p-5">
                    <h3 className="text-lg font-bold mb-1">{item.title || "Micheal Jackson 1st Floor"}</h3>
                    <p className="text-sm text-gray-500 mb-4">{item.location || "Vasant Vihar, South Delhi"}</p>
                    
                    {/* Amenities */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      {item.amenities ? (
                        item.amenities.map((amenity, i) => (
                          <div key={i} className="flex items-center">
                            <div className={`w-7 h-7 rounded-full ${amenity.color || "bg-green-500"} flex items-center justify-center mr-2`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-sm">{amenity.name}</span>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex items-center">
                            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-sm">A/C</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-sm">WiFi</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-7 h-7 rounded-full bg-orange-400 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-sm">{item.occupancy || "Single Occupancy"}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Stay Type */}
                    {item.stayType && (
                      <div className="mb-4">
                        <span className="text-xs text-red-500 border border-red-500 rounded-full px-3 py-1">
                          {item.stayType}
                        </span>
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="mt-auto">
                      <p className="text-lg font-bold mb-3">
                        Rs. {item.price || "7,000/-"} <span className="text-sm font-normal">per month</span>
                      </p>
                      
                      {/* Buttons */}
                      <div className="flex gap-3">
                        <button className="bg-[#FE6F61] text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-[#e3837a] w-full md:w-auto">
                          Book Now
                        </button>
                        <button className="border border-[#FE6F61] text-[#FE6F61] px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-100 w-full md:w-auto">
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