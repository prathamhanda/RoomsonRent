import React, { useState } from "react";

import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {Button, ButtonGroup} from "@heroui/button";
import FinancialCard from "./FinancialCard";
import {Card} from "@heroui/react";
import TenantCarousel from "./TenantCarousel";
import { TentTree } from "lucide-react";
import ListingCard from "./ListingCard";
import useFetch from "../../hooks/useFetch";

export default function LandlordPage() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);

  const premiumRooms = [
    {
      id: 1,
      name: "Micheal Jackson 1st Floor R2",
      location: "Vasanat Vihar, South Delhi",
      price: "7,000",
      amenities: ["A/C", "WiFi", "Single Occupancy", "Short Stay"],
      image: "/images/78c3c990590b6c112e5b5cb34f1fbfac.webp",
    },
    {
      id: 2,
      name: "Micheal Jackson 1st Floor R3",
      location: "Vasanat Vihar, South Delhi",
      price: "8,000",
      amenities: ["WiFi", "Triple Occupancy"],
      image: "/images/7a003bb4ff178a2ea451a316e3b92202.webp",
    },
    {
      id: 3,
      name: "Micheal Jackson 1st Floor R3",
      location: "Vasanat Vihar, South Delhi",
      price: "8,000",
      amenities: ["WiFi", "Triple Occupancy"],
      image: "/images/7a003bb4ff178a2ea451a316e3b92202.webp",
    },
    {
      id: 4,
      name: "Micheal Jackson 1st Floor R3",
      location: "Vasanat Vihar, South Delhi",
      price: "8,000",
      amenities: ["WiFi", "Triple Occupancy"],
      image: "/images/7a003bb4ff178a2ea451a316e3b92202.webp",
    },
  ];

  const testimonials = [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      name: "Ram Kapoor",
      college: "St. Stephens College",
      rating: 4,
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      name: "Ram Kapoor",
      college: "St. Stephens College",
      rating: 4,
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      name: "Ram Kapoor",
      college: "St. Stephens College",
      rating: 4,
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      name: "Ram Kapoor",
      college: "St. Stephens College",
      rating: 4,
    },
  ];

  const { data: myListings, loading: listingsLoading, error: listingsError } = useFetch('/api/listings/owner', {
    credentials: 'include'
  });


  return (
    <div>
      {/* Hero Section with Background */}
      { <div className="relative">
        <img
          src="https://media.istockphoto.com/id/1480610076/vector/real-estate-selling-concept-banner.jpg?s=612x612&w=0&k=20&c=Dx8KS_OQMBHgVAKQQmLYKiCRgRWDv_BSp4AoXZh6X9s="
          alt="home"
          className="absolute brightness-50 -z-20 pointer-events-none select-none h-[600px] w-full object-cover"
        />

        

        {/* Hero Content */}
        <div className="text-white flex flex-col gap-4 items-center pt-32 px-4 text-center">
          <h1 className="text-3xl md:text-4xl mt-10 lg:text-5xl font-bold tracking-wider">
          Landlord Management Portal
          </h1>
          <p className="text-xl md:text-2xl tracking-wider">
          your one stop solution for managing your properties!
          </p>
          
        </div>

        {/* Search Bar */}
        <div className="flex justify-center">
          <form className="flex gap-2 w-1/2" style={{ marginTop: "56px" }}>
            <div className="flex lg:w-full md:w-[85vw] flex-col">
              {/* <div className="relative w-full">
        
                <input 
                  className="h-16 rounded-full px-8 w-full outline-none" 
                  placeholder="Search for your desired college, location or PG"
                />
                <button className="w-[48px] h-[48px] rounded-full p-0 m-0 absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#fe6f61]" type="button">
                  <img alt="search" src="/images/media/Magnifer.2001df6c.svg" width="24" height="24" />
                </button>
              </div> */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="w-full max-w-3xl px-4"
              >
                <motion.div
                  className="bg-white rounded-full p-2 flex items-center shadow-lg"
                  whileHover={{ boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }}
                  animate={searchFocus ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <input
                    type="text"
                    placeholder="Search for your desired properties, tenants, etc."
                    className="w-full px-4 py-2 rounded-full focus:outline-none"
                    onFocus={() => setSearchFocus(true)}
                    onBlur={() => setSearchFocus(false)}
                  />
                  <motion.button
                    className="p-2 rounded-full text-white"
                    style={{ backgroundColor: "#fe6f61" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </form>
        </div>
      </div> }

      {/* Feature Cards */}
      <div className="px-20" style={{ marginTop: "138px" }}>
        <div className="flex gap-20 justify-between ">
          <Card className="h-32 w-full rounded-3xl p-3 bg-white">
            <div className="w-full h-full border-1 border-[#D8D8D8] rounded-2xl flex">
              <img alt="home" className="rounded-l-2xl" src="https://thumbs.dreamstime.com/b/close-up-real-estate-agent-holding-keys-his-hand-focus-high-quality-photo-316366166.jpg" width="116" height="116" />
              <div className="w-6"></div>
              <div className="flex flex-col justify-center">
                <p className="text-xl font-semibold">1 lakh+ Landlords</p>
                <p className="text-[#979797]">Find the perfect client, hassle-free.</p>
              </div>
            </div>
          </Card>
          <Card className="h-32 w-full rounded-3xl p-3 bg-white">
            <div className="w-full h-full border-1 border-[#D8D8D8] rounded-2xl flex">
              <img className="rounded-l-2xl"
                alt="home"
                src="https://images.jdmagicbox.com/comp/bangalore/k7/080pxx80.xx80.140720093203.n1k7/catalogue/padma-luxury-pg-bangalore-1bk7s0s3cc.jpg"
                width="116"
                height="116"
              />
              <div className="w-6"></div>
              <div className="flex flex-col justify-center">
                <p className="text-xl font-semibold">Exclusive Properties</p>
                <p className="text-[#979797]">
                Ideal for College Students & Working Professionals.
                </p>
              </div>
            </div>
          </Card>
          <Card className="h-32 w-full rounded-3xl p-3 bg-white">
            <div className="w-full h-full border-1 border-[#D8D8D8] rounded-2xl flex">
              <img alt="home" src="images/star.webp" width="116" height="116" />
              <div className="w-6"></div>
              <div className="flex flex-col justify-center">
                <p className="text-xl font-semibold">4.8+ Rating</p>
                <p className="text-[#979797]">
                See why tenants love staying with us.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

  

      {/* Tenant Management */}
      <div className="bg-[#F9FAFB] px-20 py-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <p className="font-bold text-4xl">
              <span className="text-[#fe6f61]">Accommodation
              </span> Statistics
            </p>
          </div>

          <div className="flex items-center relative group mx-30">
           

            <div className="flex  gap-6 p-4  w-full ">
            
            <FinancialCard emoji="🏠" title="Total Tenants (Current)" value="85" />
            <FinancialCard emoji="🏢" title="Total Capacity (Maximum)" value="120" />
            <FinancialCard emoji="📊" title="Floor Mapping (Tenants)" value="5 Floors, 17 Rooms" />
            <FinancialCard emoji="🌟" title="Potential Floor Mapping" value="6 Floors, 20 Rooms" />

            </div>
            
          </div>
        </div>
      </div>

      <div className="bg-[#F9FAFB] px-20 py-10">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-3">
              <p className="font-bold text-4xl">
                My <span className="text-[#fe6f61]">Properties</span>
              </p>
              <p className="text-[#979797]">Manage and monitor all your listed properties</p>
            </div>
            <Link 
              to="/add-listing"
              className="px-6 py-3 bg-[#fe6f61] text-white rounded-lg hover:bg-[#fe6f61]/90 transition-colors"
            >
              + Add New Property
            </Link>
          </div>

          {listingsLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fe6f61]"></div>
            </div>
          ) : listingsError ? (
            <div className="text-center text-red-500 py-8">
              Failed to load properties. Please try again later.
            </div>
          ) : myListings?.data?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't listed any properties yet.</p>
              <Link 
                to="/add-listing"
                className="text-[#fe6f61] hover:underline mt-2 inline-block"
              >
                Add your first property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {myListings?.data?.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>


      <div className="bg-[#F9FAFB] px-20 py-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <p className="font-bold text-4xl">
              <span className="text-[#fe6f61]">Current</span> Tenants
            </p>
          </div>

          <TenantCarousel />

        </div>
      </div>


      {/* Premium Accommodation Section */}
      <div className="px-20">
        <div className="flex flex-col gap-5 bg-[#F8F3EF] border-[#C59856] border-2 rounded-3xl pl-6 pt-6 relative">
          <div className="absolute w-[200px] right  -0 top-0 h-full rounded-r-[22px] bg-gradient-to-r from-[#C59856]/0 via-[#C59856]/30 via-48% to-[#C59856]/50"></div>
          <p className="font-bold text-4xl text-[#AE8549] flex gap-5">
            <img
              alt="star"
              src="/images/media/Star 1.992519b2.svg"
              width="32"
              height="31"
            />
            Vacating Tenants
          </p>

          <TenantCarousel />

        </div>
      </div>

      

      <div className="bg-[#F9FAFB] px-20 py-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <p className="font-bold text-4xl">
            How to fill the <span className="text-[#fe6f61]">Maximum
              </span> Tenants ?
            </p>
          </div>
          <div className="bg-[#F9FAFB] px-20 py-4">
        <div className="bg-landingPage-gray-light4 flex gap-10 justify-between">
          <Card className="flex-1 bg-white rounded-xl shadow-xl border border-gray-300 text-center w-full sm:w-1/5">
            <div className="flex items-center flex-col gap-6 py-4 self-center">
              <img
                alt="icon"
                src="/images/media/c1.webp"
                width="48"
                height="48"
              />
              <div className="flex text-center flex-col gap-4 p-4">
                <span className="text-xl font-bold">Update Everything Daily</span>
                <span>                
                Keep your listings fresh and updated every day to ensure potential tenants find accurate and appealing information about your accommodation.
                </span>
              </div>
            </div>
          </Card>
          <Card className="flex-1 bg-white rounded-xl shadow-xl border border-gray-300 text-center w-full sm:w-1/5">
            <div className="flex items-center flex-col gap-6 py-4 self-center">
              <img
                alt="icon"
                src="/images/media/c2.webp"
                width="48"
                height="48"
              />
              <div className="flex text-center flex-col gap-4 p-4">
                <span className="text-xl font-bold">Boost Your Seat at Just ₹99 Per Bed</span>
                <span>
                
                Offer competitive rates starting at ₹99 per bed to attract more tenants and maximize occupancy quickly.
                </span>
              </div>
            </div>
          </Card>
          </div>
          </div>

          
        </div>
      </div>
      <div className="bg-[#F9FAFB] px-20 py-4">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <p className="font-bold text-4xl">
            How to generate Maximum <span className="text-[#fe6f61]">Rentals
              </span>  ?
            </p>
          </div>
          <div className="bg-[#F9FAFB] px-20 py-4">
        <div className="bg-landingPage-gray-light4 flex gap-10 justify-between">
          <Card className="flex-1 bg-white rounded-xl shadow-xl border border-gray-300 text-center w-full sm:w-1/5">
            <div className="flex items-center flex-col gap-6 py-4 self-center">
              <img
                alt="icon"
                src="/images/media/c3.webp"
                width="48"
                height="48"
              />
              <div className="flex text-center flex-col gap-4 p-4">
                <span className="text-xl font-bold">Offer Flexible Short Stays</span>
                <span>                
                Keep your listings fresh and updated every day to ensure potential tenants find accurate and appealing information about your accommodation.
                </span>
              </div>
            </div>
          </Card>
          <Card className="flex-1 bg-white rounded-xl shadow-xl border border-gray-300 text-center w-full sm:w-1/5">
            <div className="flex items-center flex-col gap-6 py-4 self-center">
              <img
                alt="icon"
                src="/images/media/c4.webp"
                width="48"
                height="48"
              />
              <div className="flex text-center flex-col gap-4 p-4">
                <span className="text-xl font-bold">Maximize Earnings with Seasonal Offers</span>
                <span>
                
Introduce seasonal discounts or packages tailored for peak times, such as exam seasons or holidays, to boost demand and generate consistent rental income.
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

          <div className="flex items-center relative group mx-30">
           

            <div className="flex  gap-6  w-full ">
            


                </div>
            
                </div>
                </div>
                </div>
      <div className="bg-[#F9FAFB] px-20 py-10">
        <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <p className="font-bold text-4xl">
            Want us to <span className="text-[#fe6f61]">Manage
              </span> your Property ?
          </p>
        </div>
          <div className="bg-[#F9FAFB] px-20 py-10">
        <div className="bg-landingPage-gray-light4 flex gap-10 justify-between">
          <Card className="flex-1 bg-white rounded-xl shadow-xl border border-gray-300 text-center w-full sm:w-1/5">
            <div className="flex items-center flex-col gap-6 py-4 self-center">
              <img
                alt="icon"
                src="/images/media/c1.webp"
                width="48"
                height="48"
              />
              <div className="flex text-center flex-col gap-4 p-4">
                <span className="text-xl font-bold">Get Free Personalized Advice</span>
                <span>                
                
Receive expert guidance on maximizing your rental income with no added cost. Our team analyzes market trends and provides actionable strategies tailored to your property.
                </span>
              </div>
            </div>
          </Card>
          <Card className="flex-1 bg-white rounded-xl shadow-xl border border-gray-300 text-center w-full sm:w-1/5">
            <div className="flex items-center flex-col gap-6 py-4 self-center">
              <img
                alt="icon"
                src="/images/media/c2.webp"
                width="48"
                height="48"
              />
              <div className="flex text-center flex-col gap-4 p-4">
                <span className="text-xl font-bold">Stress-Free Property Management Services</span>
                <span>
                
Let us handle all aspects of property management, including tenant onboarding, rent collection, maintenance, and marketing. Enjoy hassle-free ownership while increasing profitability.
                </span>
              </div>
            </div>
          </Card>
          </div>
              </div>

         
            </div>
          </div>

    

      {/* Navigation Options Section */}
      <div className="bg-[#F9FAFB] px-20 py-10">
        <div className="flex justify-between items-center gap-8">
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="w-16 h-16 border-2 border-[#FE6F61] rounded-xl flex items-center justify-center bg-white group-hover:bg-[#FE6F61] group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FE6F61] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-[#FE6F61] font-medium text-lg">Dashboard</span>
          </div>

          <Link 
            to="/add-listing" 
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 border-2 border-[#FE6F61] rounded-xl flex items-center justify-center bg-white group-hover:bg-[#FE6F61] group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 group-hover:text-white w-8 text-[#FE6F61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-[#FE6F61] font-medium text-lg">Add Property</span>
          </Link>

          <Link 
            to="/profile" 
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 border-2 border-[#FE6F61] rounded-xl flex items-center justify-center bg-white group-hover:bg-[#FE6F61] group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 group-hover:text-white w-8 text-[#FE6F61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-[#FE6F61] font-medium text-lg">Profile</span>
          </Link>
        </div>
      </div>
      <div className="bg-red-400 w-full h-0.25"></div>

      {/* Need Assistance Section */}
      <div className="bg-[#ffffff] px-20 py-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-3">
            <p className="font-bold text-4xl">Need Assistance?</p>
            <p className="text-[#979797] font-medium">
              Feel free to reach out with any questions.
            </p>
          </div>
          <div className="flex gap-12">
            <div className="relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#25D366] text-white text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">
                2 Mins Reply
              </div>
              <a
                href="https://chat.whatsapp.com/D8XEoda1w2GBAeO2gtMT0b"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center border rounded-xl p-4 px-12 flex-col gap-4"
              >
                <img
                  alt="icon"
                  src="/images/media/whatsapp.webp"
                  width="48"
                  height="48"
                />
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-bold">WhatsApp us</span>
                </div>
              </a>
            </div>
            <a
              href="tel:+916207409628"
              target="_self"
              className="flex items-center border rounded-xl p-4 px-12 flex-col gap-4"
            >
              <img
                alt="icon"
                src="/images/media/Phone Calling Rounded.webp"
                width="48"
                height="48"
              />
              <div className="flex flex-col gap-2">
                <span className="text-lg font-bold">+91 62074 09628</span>
              </div>
            </a>
            <a
              href="mailto:officialroomsonrent@gmail.com"
              target="_self"
              className="flex items-center border rounded-xl p-4 px-12 flex-col gap-4"
            >
              <img
                alt="icon"
                src="/images/media/Letter.webp"
                width="48"
                height="48"
              />
              <div className="flex flex-col gap-2">
                <span className="text-lg font-bold">Email us</span>
              </div>
            </a>
          </div>
        </div>
      </div>
  <div className="bg-red-400 w-full h-0.5"></div>
      {/* Where We Operate Section */}
      <div className="px-20 my-10">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <p className="font-bold text-4xl">
              Where we <span className="text-[#fe6f61]">operate</span>
            </p>
            <p className="text-[#979797] font-medium">
              Trusted student lodging near key universities and bustling zones
              in Delhi.
            </p>
          </div>
          <div className="flex gap-5">
            <div className="flex flex-col flex-1 gap-3">
              <p className="text-[#FE6F61] font-bold text-lg mb-1">
                South Delhi
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Malviya Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">Saket</p>
              <p className="text-sm text-[#666666] font-semibold">Hauz Khas</p>
              <p className="text-sm text-[#666666] font-semibold">Kalkaji</p>
              <p className="text-sm text-[#666666] font-semibold">
                Greater Kailash
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Lajpat Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">Green Park</p>
              <p className="text-sm text-[#666666] font-semibold">
                Vasant Kunj
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Sheikh Sarai
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Satya Niketan
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Chirag Delhi
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Bikaji Cama Place
              </p>
              <p className="text-sm text-[#666666] font-semibold">Munirka</p>
              <p className="text-sm text-[#666666] font-semibold">
                Safdarjung Enclave
              </p>
              <p className="text-sm text-[#666666] font-semibold">Mehrauli</p>
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <p className="text-[#FE6F61] font-bold text-lg mb-1">
                North Delhi
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Mukherjee Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Kamla Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Hudson Lane
              </p>
              <p className="text-sm text-[#666666] font-semibold">Model Town</p>
              <p className="text-sm text-[#666666] font-semibold">GTB Road</p>
              <p className="text-sm text-[#666666] font-semibold">
                Old Rajinder Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Shakti Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Vijay Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Patel Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">Karol Bagh</p>
              <p className="text-sm text-[#666666] font-semibold">
                Outram Lines
              </p>
              <p className="text-sm text-[#666666] font-semibold">Roop Nagar</p>
              <p className="text-sm text-[#666666] font-semibold">
                Kingsway Camp
              </p>
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <p className="text-[#FE6F61] font-bold text-lg mb-1">
                East Delhi
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Laxmi Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Mayur Vihar (Phase I)
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Mayur Vihar (Phase II)
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Mayur Vihar (Phase III)
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Preet Vihar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Karkardooma
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Vasundhara Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                IP Extension
              </p>
              <p className="text-sm text-[#666666] font-semibold">Shakarpur</p>
              <p className="text-sm text-[#666666] font-semibold">Patparganj</p>
              <p className="text-sm text-[#666666] font-semibold">
                Pandav Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Anand Vihar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Geeta Colony
              </p>
              <p className="text-sm text-[#666666] font-semibold">Ghaziabad</p>
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <p className="text-[#FE6F61] font-bold text-lg mb-1">
                West Delhi
              </p>
              <p className="text-sm text-[#666666] font-semibold">Janakpuri</p>
              <p className="text-sm text-[#666666] font-semibold">
                Uttam Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Rajouri Garden
              </p>
              <p className="text-sm text-[#666666] font-semibold">Vikaspuri</p>
              <p className="text-sm text-[#666666] font-semibold">
                Subhash Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Tilak Nagar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Paschim Vihar
              </p>
              <p className="text-sm text-[#666666] font-semibold">Dwarka Mor</p>
              <p className="text-sm text-[#666666] font-semibold">
                Naraina Vihar
              </p>
              <p className="text-sm text-[#666666] font-semibold">
                Tagore Garden
              </p>
              <p className="text-sm text-[#666666] font-semibold">Moti Nagar</p>
              <p className="text-sm text-[#666666] font-semibold">
                Kirti Nagar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#FE6F61] h-[250px] flex items-center py-10 text-white">
        <Link
          href="/"
          className="flex-1 h-full flex items-center justify-center text-6xl font-bold"
        >
          ROR
        </Link>
        <div className="h-full w-[1px] bg-[#CCCCCC]"></div>
        <div className="flex-1 h-full flex justify-center items-center flex-col gap-5">
          <p className="text-2xl font-semibold">CONTACT US!</p>
          <div className="text-lg">
            <a href="tel:+916207409628" className="block text-center">
              +91 62074 09628
            </a>
            <a href="mailto:officialroomsonrent@gmail.com" className="block">
              officialroomsonrent@gmail.com
            </a>
          </div>
        </div>
        <div className="h-full w-[1px] bg-[#CCCCCC]"></div>
        <div className="flex-1 h-full flex flex-col justify-center items-center gap-5">
          <p className="text-2xl font-semibold">FOLLOW US!</p>
          <div className="flex gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <img
                alt="twitter"
                src="/images/media/icons8-twitter-bird.ebc67185.svg"
                width="50"
                height="50"
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <img
                alt="linkedin"
                src="/images/media/icons8-linkedin.4a98e29e.svg"
                width="50"
                height="50"
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img
                alt="instagram"
                src="/images/media/icons8-instagram.2fe214cb.svg"
                width="50"
                height="50"
              />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <img
                alt="facebook"
                src="/images/media/icons8-facebook.d9ed0702.svg"
                width="50"
                height="50"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
