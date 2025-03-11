import { useState } from 'react'
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
    title: "Card 1",
    description: "Description for card 1"
  },
  {
    title: "Card 2",
    description: "Description for card 2"
  },
  {
    title: "Card 3",
    description: "Description for card 3"
  },
  {
    title: "Card 4",
    description: "Description for card 4"
  },
  {
    title: "Card 5",
    description: "Description for card 5"
  }
];

function App() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredColleges, setFilteredColleges] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = colleges.filter(college =>
        college.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredColleges(filtered);
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
      <span key={index} style={{ color: 'black', fontWeight: 'bold' }}>{part}</span> : 
      <span key={index} style={{ color: 'grey' }}>{part}</span>
    );
  };

  // Add new carousel data
  const bottomCarouselItems = [
    {
      title: "Featured PG 1",
      description: "Luxury PG accommodation near campus"
    },
    {
      title: "Featured PG 2",
      description: "Budget-friendly student housing"
    },
    {
      title: "Featured PG 3",
      description: "Premium student apartments"
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
      image: "https://amity.edu/images/university.jpg",
      title: "Feature Title",
      description: "Brief description of the feature goes here"
    },
    {
      image: "https://amity.edu/images/university.jpg",
      title: "Feature Title",
      description: "Brief description of the feature goes here"
    },
    {
      image: "https://amity.edu/images/university.jpg",
      title: "Feature Title",
      description: "Brief description of the feature goes here"
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
            src="https://s3-alpha-sig.figma.com/img/56b0/ed61/47d156d39faad32eb98b6ce7f9110a0b?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ss~IppWo~DZLW8EdD3mx4-yUDw-1wJEP6RchqXHas~A-kMS6~kQLzBplW1q59zJX~Gf5rKrwssnvbQCo~CjQ-6jUhqhBaR3rw2-Q1tYMltGGGEcSK4-0I0~toRvfSenyA~0J66Hmz86~kL3AGwD7SVilCJCK7vPXzG-5C7qAX9eMd79xXejj60gHXj9nbnK6G3-yOu9HP-~4lRybMv5wlRoiVSHp2JczrSml62rwlU21njI6UkB~vL6rHETZ3bfefdPM612B56bG-buY~o~ihcK-~~-JqR42ki~JyvMlJc-WvAKXzyAEivGONPxeHBSd~HVhKGT2Kpi0cHRceiakzQ__" 
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
            <div className="relative w-3/4 mx-auto mt-8">
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
                    {filteredColleges.slice(0, 3).map((college, index) => (
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
          <div className="p-4 pl-2">
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

        <h1 className='text-black px-5 md:px-20 py-2 text-3xl md:text-4xl font-montserrat font-bold tracking-wide'>Book your favourite room in <span className='text-[#FE6F61]'>3 simple steps</span></h1>

        <h1 className='text-[#979797] px-5 md:px-20 text-[16px] tracking-wide font-semibold font-montserrat'>What do our 10k+ Students have to say about their experience with ROR</h1>

        {/* New Divs Section */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row gap-32 px-20 mb-4 justify-between items-center ">
            <div className="flex flex-col items-center text-center h-[142px] rounded-xl shadow-md border border-gray-300 ">
              <h2 className="text-xl font-bold text-black">Discover & Choose</h2>
              <p className="text-gray-600 text-left p-4">Choose and pick from a plethora of verified student Flats & PGs</p>
            </div>
            <div className="flex flex-col items-center text-center h-[142px] rounded-xl shadow-md border border-gray-300">
              <h2 className="text-xl font-bold text-black">Fill in your details</h2>
              <p className="text-gray-600">Fill in all your necessary personal details required for the booking.</p>
            </div>
            <div className="flex flex-col items-center text-center h-[142px] rounded-xl shadow-md border border-gray-300">
              <h2 className="text-xl font-bold text-black">Accommodation Secured!</h2>
              <p className="text-gray-600">Take it easy, pack up, and embark on a new chapter of life!</p>
            </div>
          </div>

          <div className="text-center bg-gray-100 flex flex-wrap items-center font-montserrat py-10">
            <div className='text-black flex flex-col p-5 px-20 w-full md:w-1/2 text-left'>
              <h2 className='font-bold text-[36px] '>Need Assistance?</h2>
              <p className='text-[16px] text-[#656565]'>Feel free to reach out with any questions.</p>
            </div>
            
            <div className='icons flex flex-wrap gap-4 justify-center items-center font-extrabold w-full md:w-1/2'>
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