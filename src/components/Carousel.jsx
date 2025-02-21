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
            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
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