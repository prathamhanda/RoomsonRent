import { useState, useRef, useEffect } from 'react'
import { Link, Routes, Route, useLocation } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Navbar from './navbar.jsx';
import Carousel from './components/Carousel';
import FeatureCard from './components/FeatureCard';
import GallerySection from './components/GallerySection';
import Footer from './components/Footer.jsx';
import CreateListing from './components/CreateListing.jsx';

// Add this sample data

const colleges = [
  "Zakir Husain College Delhi",
  "Jesus and Mary College",
  "Sri Guru Gobind Singh College of Commerce",
  "Shri Ram College of Commerce",
  "Sri Venkateswara College",
  "Lady Shri Ram College for Women",
  "Hindu College",
  "Hansraj College",
  "Gargi College",
  "Daulat Ram College",
  "Delhi College of Arts & Commerce",
  "Deen Dayal Upadhyaya College",
  "Indraprastha College for Women",
  "Janki Devi Memorial College",
  "Kamala Nehru College",
  "Kirori Mal College",
  "Lakshmibai College",
  "Maitreyi College",
  "Miranda House",
  "Motilal Nehru College",
  "PGDAV College",
  "Ramjas College",
  "Shaheed Bhagat Singh College",
  "Shivaji College",
  "Sri Aurobindo College",
  "Sri Guru Tegh Bahadur Khalsa College",
  "Vivekananda College",
  "Atma Ram Sanatan Dharma College",
  "Bhaskaracharya College of Applied Sciences",
  "Deshbandhu College",
  "Maharaja Agrasen College",
  "Rajdhani College",
  "Ramanujan College",
  "Shaheed Rajguru College of Applied Sciences for Women",
  "Swami Shraddhanand College",
  "Acharya Narendra Dev College",
  "Aditi Mahavidyalaya",
  "Aryabhatta College",
  "College of Vocational Studies",
  "Dyal Singh College",
  "Institute of Home Economics",
  "Jawaharlal Nehru Rajkiya Mahavidyalaya",
  "Kalindi College",
  "Keshav Mahavidyalaya",
  "Maharishi Valmiki College of Education",
  "Moti Lal Nehru College (Evening)",
  "PGDAV College (Evening)",
  "Pannalal Girdharlal Dayanand Anglo Vedic College",
  "Ram Lal Anand College",
  "Satyawati College",
  "Satyawati College (Evening)",
  "Shaheed Sukhdev College of Business Studies",
  "Shyam Lal College",
  "Shyam Lal College (Evening)",
  "Sri Guru Nanak Dev Khalsa College",
  "Swami Vivekananda College",
  "Bhagini Nivedita College",
  "Delhi Pharmaceutical Sciences and Research University",
  "Dr. Bhim Rao Ambedkar College",
  "Ghalib Institute",
  "Guru Gobind Singh Indraprastha University",
  "Indian Institute of Technology Delhi",
  "Indira Gandhi Delhi Technical University for Women",
  "Jamia Hamdard",
  "Jamia Millia Islamia",
  "Lady Irwin College",
  "Maharaja Surajmal Institute",
  "Netaji Subhas University of Technology",
  "School of Planning and Architecture, Delhi",
  "University of Delhi"
];

const areas = {
  "South Delhi": [
    "Malviya Nagar", "Saket", "Hauz Khas", "Kalkaji", "Greater Kailash",
    "Lajpat Nagar", "Green Park", "Vasant Kunj", "Sheikh Sarai", "Satya Niketan",
    "Chirag Delhi", "Bikaji Cama Place", "Munirka", "Safdarjung Enclave", "Mehrauli"
  ],
  "North Delhi": [
    "Mukherjee Nagar", "Kamla Nagar", "Hudson Lane", "Model Town", "GTB Road",
    "Old Rajinder Nagar", "Shakti Nagar", "Vijay Nagar", "Patel Nagar", "Karol Bagh",
    "Outram Lines", "Roop Nagar", "Kingsway Camp"
  ],
  "East Delhi": [
    "Laxmi Nagar", "Mayur Vihar (Phase I)", "Mayur Vihar (Phase II)", "Mayur Vihar (Phase III)",
    "Preet Vihar", "Karkardooma", "Vasundhara Nagar", "IP Extension", "Shakarpur",
    "Patparganj", "Pandav Nagar", "Anand Vihar", "Geeta Colony", "Ghaziabad"
  ],
  "West Delhi": [
    "Janakpuri", "Uttam Nagar", "Rajouri Garden", "Vikaspuri", "Subhash Nagar",
    "Tilak Nagar", "Paschim Vihar", "Dwarka Mor", "Naraina Vihar", "Tagore Garden",
    "Moti Nagar", "Kirti Nagar"
  ]
};

const carouselItems = [
  {
    title: "Micheal Jackson 1st Floor R2",
    location: "Vasant Vihar, South Delhi",
    image: "https://images.trvl-media.com/lodging/23000000/22410000/22408200/22408101/b1d9ae65.jpg",
    price: "7,000/-",
    occupancy: "Single Occupancy",
    amenities: [
      { name: "A/C", color: "bg-green-500" },
      { name: "WiFi", color: "bg-green-500" },
      { name: "Single Occupancy", color: "bg-orange-400" }
    ],
    stayType: "Short Stay"
  },
  {
    title: "Micheal Jackson 1st Floor R3",
    location: "Vasant Vihar, South Delhi",
    image: "https://images.trvl-media.com/lodging/23000000/22410000/22408200/22408101/b1d9ae65.jpg",
    price: "8,000/-",
    occupancy: "Triple Occupancy",
    amenities: [
      { name: "WiFi", color: "bg-green-500" },
      { name: "Triple Occupancy", color: "bg-orange-400" }
    ],
    stayType: null
  },
  {
    title: "Micheal Jackson 2nd Floor R1",
    location: "Vasant Vihar, South Delhi",
    image: "https://images.trvl-media.com/lodging/23000000/22410000/22408200/22408101/b1d9ae65.jpg",
    price: "8,000/-",
    occupancy: "Double Occupancy",
    amenities: [
      { name: "WiFi", color: "bg-green-500" },
      { name: "A/C", color: "bg-green-500" },
      { name: "Double Occupancy", color: "bg-orange-400" }
    ],
    stayType: null
  }
];

function App() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredColleges, setFilteredColleges] = useState([]);
  const testimonialScrollRef = useRef(null);
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);

  // Add useEffect for testimonial carousel navigation
  useEffect(() => {
    const scrollContainer = testimonialScrollRef.current;
    const leftArrow = leftArrowRef.current;
    const rightArrow = rightArrowRef.current;
    
    if (scrollContainer && leftArrow && rightArrow) {
      const handleLeftClick = () => {
        scrollContainer.scrollBy({ left: -350, behavior: 'smooth' });
      };
      
      const handleRightClick = () => {
        scrollContainer.scrollBy({ left: 350, behavior: 'smooth' });
      };
      
      leftArrow.addEventListener('click', handleLeftClick);
      rightArrow.addEventListener('click', handleRightClick);
      
      return () => {
        leftArrow.removeEventListener('click', handleLeftClick);
        rightArrow.removeEventListener('click', handleRightClick);
      };
    }
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = colleges.filter(college =>
        college.toLowerCase().includes(value.toLowerCase())
      );

      // Sort suggestions: first by those starting with the input, then by those containing it
      const sortedFiltered = filtered.sort((a, b) => {
        const aStartsWith = a.toLowerCase().startsWith(value.toLowerCase());
        const bStartsWith = b.toLowerCase().startsWith(value.toLowerCase());

        if (aStartsWith && !bStartsWith) return -1; // a comes first
        if (!aStartsWith && bStartsWith) return 1;  // b comes first
        return a.localeCompare(b); // alphabetical order
      });

      setFilteredColleges(sortedFiltered);
    } else {
      setFilteredColleges([]);
    }
  };

  const handleSuggestionClick = (college) => {
    setSearchTerm(college);
    setFilteredColleges([]);
  };

  const highlightMatch = (text) => {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
      <span key={index} style={{ color: 'black', textAlign:'left' }}>{part}</span> : 
      <span key={index} style={{ color: 'black' }}>{part}</span>
    );
  };

  // Add new carousel data
  const bottomCarouselItems = [
    {
      title: "Luxury PG Near North Campus",
      location: "Kamla Nagar, North Delhi",
      image: "https://images.trvl-media.com/lodging/23000000/22410000/22408200/22408101/b1d9ae65.jpg",
      price: "9,500/-",
      occupancy: "Single Occupancy",
      amenities: [
        { name: "A/C", color: "bg-green-500" },
        { name: "WiFi", color: "bg-green-500" },
        { name: "Meals", color: "bg-blue-500" },
        { name: "Single Occupancy", color: "bg-orange-400" }
      ],
      stayType: "Short Stay"
    },
    {
      title: "Budget PG in South Campus",
      location: "Satya Niketan, South Delhi",
      image: "https://img.staticmb.com/mbphoto/locality/cropped_images/2022/Jan/22/Photo_h470_w1080/80367_Triente-Suites1_470_1080.jpg",
      price: "6,000/-",
      occupancy: "Triple Occupancy",
      amenities: [
        { name: "WiFi", color: "bg-green-500" },
        { name: "Triple Occupancy", color: "bg-orange-400" }
      ],
      stayType: null
    },
    {
      title: "Premium Flat for Students",
      location: "Laxmi Nagar, East Delhi",
      image: "https://img.staticmb.com/mbphoto/locality/cropped_images/2024/Jul/23/Photo_h470_w1080/53480_20230605_131543---arun-shrivastav_470_1080.jpg",
      price: "12,000/-",
      occupancy: "Double Occupancy",
      amenities: [
        { name: "WiFi", color: "bg-green-500" },
        { name: "A/C", color: "bg-green-500" },
        { name: "Gym", color: "bg-purple-500" },
        { name: "Double Occupancy", color: "bg-orange-400" }
      ],
      stayType: null
    }
  ];

  const galleryItemsNorth = [
    { image: 'https://images.trvl-media.com/lodging/23000000/22410000/22408200/22408101/b1d9ae65.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', title: 'Kamal Nagar' },
    { image: 'https://img.staticmb.com/mbphoto/locality/cropped_images/2022/Jan/22/Photo_h470_w1080/80367_Triente-Suites1_470_1080.jpg', title: 'Kalyan Vihar' },
    { image: 'https://img.staticmb.com/mbphoto/locality/cropped_images/2024/Jul/23/Photo_h470_w1080/53480_20230605_131543---arun-shrivastav_470_1080.jpg', title: 'Roop Nagar' },
    { image: 'https://static.toiimg.com/thumb/msid-92217326,width-1280,height-720,resizemode-72/92217326.jpg', title: 'Ghanta Ghar' },
    { image: 'https://static.squareyards.com/reviewrating/images/1718265003675.jpeg?aio=w-568;h-377;crop;', title: 'Shakti Nagar' },
  ];

  const galleryItemsSouth = [
    { image: 'https://images.trvl-media.com/lodging/23000000/22410000/22408200/22408101/b1d9ae65.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', title: 'Kamal Nagar' },
    { image: 'https://img.staticmb.com/mbphoto/locality/cropped_images/2022/Jan/22/Photo_h470_w1080/80367_Triente-Suites1_470_1080.jpg', title: 'Kalyan Vihar' },
    { image: 'https://img.staticmb.com/mbphoto/locality/cropped_images/2024/Jul/23/Photo_h470_w1080/53480_20230605_131543---arun-shrivastav_470_1080.jpg', title: 'Roop Nagar' },
    { image: 'https://static.toiimg.com/thumb/msid-92217326,width-1280,height-720,resizemode-72/92217326.jpg', title: 'Ghanta Ghar' },
    { image: 'https://static.squareyards.com/reviewrating/images/1718265003675.jpeg?aio=w-568;h-377;crop;', title: 'Shakti Nagar' },
  ];

  const galleryItemsOff = [
    { image: 'https://images.trvl-media.com/lodging/23000000/22410000/22408200/22408101/b1d9ae65.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', title: 'Kamal Nagar' },
    { image: 'https://img.staticmb.com/mbphoto/locality/cropped_images/2022/Jan/22/Photo_h470_w1080/80367_Triente-Suites1_470_1080.jpg', title: 'Kalyan Vihar' },
    { image: 'https://img.staticmb.com/mbphoto/locality/cropped_images/2024/Jul/23/Photo_h470_w1080/53480_20230605_131543---arun-shrivastav_470_1080.jpg', title: 'Roop Nagar' },
    { image: 'https://static.toiimg.com/thumb/msid-92217326,width-1280,height-720,resizemode-72/92217326.jpg', title: 'Ghanta Ghar' },
    { image: 'https://static.squareyards.com/reviewrating/images/1718265003675.jpeg?aio=w-568;h-377;crop;', title: 'Shakti Nagar' },
  ];

  const featureData = [
    {
      image: "https://alexandro.in/image/hyderabad/settl-bron/1.jpg",
      title: "1 lakh+ Beds",
      description: "Book the one perfect for you"
    },
    {
      image: "https://images.shiksha.com/mediadata/images/articles/1662370481phpb8qpYu.jpeg",
      title: "35+ DU Colleges",
      description: "Search accomodation by your college"
    },
    {
      image: "https://images.indianexpress.com/2023/12/feedback-7323668_1920.png?w=414",
      title: "4.8+ Rating",
      description: "What our students think about us"
    }
    // Add more features as needed
  ];

  // Ensure that the carousel items are not empty
  if (!carouselItems.length) {
    console.error("Carousel items are empty");
  }

  return (
    <Routes>
      <Route path="/createlisting" element={<CreateListing />} />
      <Route path="/" element={
        <>
        <Navbar />
        <div className="relative">
          <img 
            src="https://amity.edu/images/university.jpg" 
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
            <div className="relative w-1/2 mx-auto mt-8">
              <input 
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
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
              {filteredColleges.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-[#FE6F61] rounded-lg shadow-lg mt-1 suggestion-box">
                  <div className="max-h-40 overflow-y-auto">
                    {filteredColleges.map((college, index) => (
                      <div 
                        key={index} 
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleSuggestionClick(college)}
                      >
                        {highlightMatch(college)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
        <h1 className='text-black px-5 md:px-20 py-5 text-3xl md:text-4xl font-montserrat font-bold tracking-wide'>Your <span className='text-[#FE6F61]'>Perfect</span> Accommodation</h1>
        <Carousel items={carouselItems} />
        
        {/* New gradient div with carousel */}
        <div className="mx-5 md:mx-20 my-7 rounded-xl border-2 border-[#AE8549] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#AE8549]/20 to-white/0 pointer-events-none" />
          <div className="p-2 ">
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

        <h1 className='text-black px-5 md:px-20 py-2 text-3xl md:text-4xl font-montserrat font-bold tracking-wide'>Popular areas for<span className='text-[#FE6F61]'> students </span>in Delhi</h1>

        <h1 className='text-[#979797] px-5 md:px-20 text-[16px] tracking-wide font-semibold font-montserrat'>Book student accommodations near universities around Delhi</h1>

        {/* Gallery Section */}
        <GallerySection title="North Campus" items={galleryItemsNorth} />
        <GallerySection title="South Campus" items={galleryItemsSouth} />
        <GallerySection title="Off Campus" items={galleryItemsOff} />

        {/* Testimonials Section */}
        <div className="bg-white py-16 relative">
          <div className="container mx-auto px-5 md:px-20">
            <h1 className="text-black text-3xl md:text-4xl font-montserrat font-bold tracking-wide">
              What do <span className="text-[#FE6F61]">students</span> say about us?
            </h1>
            <p className="text-[#979797] text-[16px] tracking-wide font-montserrat mt-2 mb-10">
              What do our 10k+ Students have to say about their experience with ROR
            </p>
            
            <div className="testimonial-container relative">
              {/* Left Arrow */}
              <button 
                ref={leftArrowRef}
                className="testimonial-arrow left-arrow absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center z-10 opacity-0 transition-opacity duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Testimonial Cards Carousel */}
              <div 
                ref={testimonialScrollRef}
                className="testimonial-scroll flex gap-6 pb-8 overflow-x-auto scroll-smooth hide-scrollbar"
              >
                {/* Testimonial Card 1 */}
                <div className="testimonial-card min-w-[300px] max-w-[350px] bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex-shrink-0 transition-all duration-300">
                  <p className="text-gray-700 mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <div className="flex items-center">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="Ram Kapoor" 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">Ram Kapoor</h3>
                      <p className="text-sm text-gray-500">St. Stephens College</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <span className="font-bold mr-1">4</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial Card 2 */}
                <div className="testimonial-card min-w-[300px] max-w-[350px] bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex-shrink-0 transition-all duration-300">
                  <p className="text-gray-700 mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <div className="flex items-center">
                    <img 
                      src="https://randomuser.me/api/portraits/men/33.jpg" 
                      alt="Ram Kapoor" 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">Ram Kapoor</h3>
                      <p className="text-sm text-gray-500">St. Stephens College</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <span className="font-bold mr-1">4</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial Card 3 */}
                <div className="testimonial-card min-w-[300px] max-w-[350px] bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex-shrink-0 transition-all duration-300">
                  <p className="text-gray-700 mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <div className="flex items-center">
                    <img 
                      src="https://randomuser.me/api/portraits/men/34.jpg" 
                      alt="Ram Kapoor" 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">Ram Kapoor</h3>
                      <p className="text-sm text-gray-500">St. Stephens College</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <span className="font-bold mr-1">4</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial Card 4 */}
                <div className="testimonial-card min-w-[300px] max-w-[350px] bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex-shrink-0 transition-all duration-300">
                  <p className="text-gray-700 mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <div className="flex items-center">
                    <img 
                      src="https://randomuser.me/api/portraits/men/35.jpg" 
                      alt="Ram Kapoor" 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">Ram Kapoor</h3>
                      <p className="text-sm text-gray-500">St. Stephens College</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <span className="font-bold mr-1">4</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Arrow */}
              <button 
                ref={rightArrowRef}
                className="testimonial-arrow right-arrow absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center z-10 opacity-0 transition-opacity duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .testimonial-container:hover .testimonial-arrow {
            opacity: 1;
          }
          
          .testimonial-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          }
          
          .testimonial-arrow {
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .testimonial-arrow:hover {
            background-color: #FE6F61;
          }
          
          .testimonial-arrow:hover svg {
            color: white;
          }
        `}</style>

        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        <h1 className='text-[#2D2D2D] text-4xl md:text-5xl font-bold mb-3'>Book your favourite room in <span className='text-[#FF6B6B]'>3 simple steps</span></h1>
        <p className='text-[#979797] text-lg mb-12'>What do our 10k+ Students have to say about their experience with ROR</p>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
          {/* Step 1 */}
          <div className="w-full md:w-1/3 bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <div className="mb-6">
              <svg className="w-12 h-12 text-[#FF6B6B]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M11 7V11L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">Discover & Choose</h2>
            <p className="text-gray-600">Choose and pick from a plethora of verified student Flats & PGs</p>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:block w-24">
            <svg className="w-full text-gray-300" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12H95M95 12L85 2M95 12L85 22" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>

          {/* Step 2 */}
          <div className="w-full md:w-1/3 bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <div className="mb-6">
              <svg className="w-12 h-12 text-[#FF6B6B]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 7H17M7 12H17M7 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">Fill in your details</h2>
            <p className="text-gray-600">Fill in all your necessary personal details required for the booking.</p>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:block w-24">
            <svg className="w-full text-gray-300" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12H95M95 12L85 2M95 12L85 22" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>

          {/* Step 3 */}
          <div className="w-full md:w-1/3 bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <div className="mb-6">
              <svg className="w-12 h-12 text-[#FF6B6B]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12L5 10M5 10L12 3L19 10M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">Accommodation Secured!</h2>
            <p className="text-gray-600">Take it easy, pack up, and embark on a new chapter of life!</p>
          </div>
        </div>
      </div>

        {/* New Divs Section */}
        <div className="py-6">
         

          <div className="text-center bg-gray-100 flex flex-wrap items-center font-montserrat py-10">
            <div className='text-black flex flex-col p-5 px-20 w-full md:w-1/2 text-left'>
              <h2 className='font-bold text-[36px] '>Need Assistance?</h2>
              <p className='text-[16px] text-[#656565]'>Feel free to reach out with any questions.</p>
            </div>
            
            <div className='icons flex flex-wrap gap-4 justify-center items-center font-extrabold w-full md:w-2/1'>
              <a href="https://wa.me/916207409628" className='h-[125px] w-full max-w-[220px] bg-transparent border-2 border-gray-600 rounded-lg flex flex-col justify-center items-center text-center transition-transform transform hover:scale-105 hover:bg-gray-200'>
                <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" alt="whatsapp logo" className='h-[38px]' />
                <h1 className='text-[16px] font-montserrat text-black'>WhatsApp Chat</h1>
              </a>
              <a href="tel:+916207409628" className='icons h-[125px] w-full max-w-[220px] bg-transparent border-2 border-gray-600 rounded-lg flex flex-col justify-center items-center text-center transition-transform transform hover:scale-105 hover:bg-gray-200'>
                <img src="https://img.icons8.com/?size=100&id=47813&format=png&color=000000" alt="call logo" className='h-[38px]' />
                <h1 className='text-[16px] font-montserrat text-black'>+91 62074 09628</h1>
              </a>
              <a href="mailto:example@example.com" className='icons h-[125px] w-full max-w-[220px] bg-transparent border-2 border-gray-600 rounded-lg flex flex-col justify-center items-center text-center transition-transform transform hover:scale-105 hover:bg-gray-200'>
                <img src="https://img.icons8.com/?size=100&id=mtfWz20b5AxB&format=png&color=000000" alt="email logo" className='h-[40px]' />
                <h1 className='text-[16px] font-montserrat text-black'>Email us</h1>
              </a>
            </div>
          </div>

          <style jsx>{`
            @media (max-width: 768px) {
              .icons {
                flex-direction: column;
              }
            }
          `}</style>

          <h1 className='text-black px-5 md:px-20 mt-2 text-3xl md:text-4xl font-montserrat font-bold tracking-wide'>Where we <span className='text-[#FE6F61]'>operate</span></h1>
          <h1 className='text-[#979797] px-5 mb-4 mt-2 md:px-20 text-[16px] tracking-wide font-semibold font-montserrat'>Trusted student lodging near key universities and bustling zones in Delhi.</h1>

          <div className="grid px-20 grid-cols-1 md:grid-cols-4 gap-4  text-gray-600">
            {Object.entries(areas).map(([region, locations]) => (
              <div key={region}>
                <h3 className="font-bold text-[#FE6F61] mt-4 mb-4 text-[18px]">{region}</h3>
                <ul>
                  {locations.map(location => (
                    <li key={location} className="mb-2 text-[16px]">{location}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>


        <Footer />
        </>
      } />
    </Routes>
  )
}

export default App
