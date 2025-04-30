import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@heroui/card";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const testimonials = [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      name: "Raj Malhotra",
      property: "Malhotra PG, South Delhi",
      rating: 4.8,
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      name: "Priya Sharma",
      property: "Sharma Residency, North Delhi",
      rating: 4.7,
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      name: "Ankit Gupta",
      property: "Student Haven, Kamla Nagar",
      rating: 4.9,
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      name: "Sunita Kapoor",
      property: "Kapoor Flats, Lajpat Nagar",
      rating: 4.6,
    },
  ];

  // Reusable feature card component
  const FeatureCard = ({ icon, title, description, className = "" }) => (
    <Card className={`bg-white rounded-xl shadow-md border border-gray-300 text-center ${className}`}>
      <div className="flex items-center flex-col gap-4 p-4">
        <img alt={title} src={icon} width="48" height="48" className="w-12 h-12" />
        <div className="flex text-center flex-col gap-2">
          <span className="text-lg font-bold">{title}</span>
          <span className="text-xs">{description}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Background */}
      <div className="relative">
        <img
          src="/ror-home-img.webp"
          alt="home"
          className="absolute -z-20 pointer-events-none select-none h-[650px] w-full object-cover brightness-[0.85]"
        />

        {/* Hero Content */}
        <div className="text-white flex flex-col gap-4 items-center pt-40 px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-3xl font-bold tracking-wider">
            Partner With Delhi's Premier Student Housing Platform
          </h1>
          <p className="text-xl md:text-2xl tracking-wider">
            List your property and connect with thousands of verified students
          </p>
          <button onClick={() => window.location.href = '/login'} className="mt-8 bg-[#FE6F61] hover:bg-[#e55a4d] text-white py-3 px-8 rounded-full font-semibold text-lg transition-all">
            Join as Landlord
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="px-4 md:px-8 lg:px-20 mt-24 md:mt-32 lg:-mb-[7em]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="rounded-3xl p-3 bg-white hover:shadow-lg transition-shadow">
            <div className="h-full border border-[#D8D8D8] rounded-2xl flex items-center p-4">
              <img alt="students" src="images/bed.png" className="w-20 h-20 object-contain" />
              <div className="ml-4">
                <p className="text-xl font-semibold">10,000+ Students</p>
                <p className="text-[#979797] text-sm">Connect with verified student tenants</p>
              </div>
            </div>
          </Card>
          
          <Card className="rounded-3xl p-3 bg-white hover:shadow-lg transition-shadow">
            <div className="h-full border border-[#D8D8D8] rounded-2xl flex items-center p-4">
              <img alt="college" src="images/building.webp" className="w-20 h-20 object-contain" />
              <div className="ml-4">
                <p className="text-xl font-semibold">35+ DU Colleges Covered</p>
                <p className="text-[#979797] text-sm">Reach students from top institutions</p>
              </div>
            </div>
          </Card>
          
          <Card className="rounded-3xl p-3 bg-white md:col-span-2 lg:col-span-1 hover:shadow-lg transition-shadow">
            <div className="h-full border border-[#D8D8D8] rounded-2xl flex items-center p-4">
              <img alt="rating" src="images/star.webp" className="w-20 h-20 object-contain" />
              <div className="ml-4">
                <p className="text-xl font-semibold">Higher Occupancy Rates</p>
                <p className="text-[#979797] text-sm">Minimize vacancies & maximize returns</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Landlord Benefits Section */}
      <div className="bg-[#F9FAFB] px-4 md:px-8 lg:px-20 py-16 mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 lg:mt-[2em]">Benefits for <span className="text-[#fe6f61]">Property Owners</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon="/images/media/c1.webp"
            title="Zero Listing Fee"
            description="List your property with no upfront costs or hidden charges"
          />
          <FeatureCard 
            icon="/images/media/c2.webp"
            title="Verified Students Only"
            description="All student profiles are verified with college ID proof"
          />
          <FeatureCard 
            icon="/images/media/c3.webp"
            title="Dedicated Relationship Manager"
            description="Get personalized support from our dedicated team"
          />
          <FeatureCard 
            icon="/images/media/c4.webp"
            title="Digital Rent Management"
            description="Collect rent digitally with our secure payment system"
          />
        </div>
      </div>

      {/* Property Management Features */}
      <div className="px-4 md:px-8 lg:px-20 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
          <span className="text-[#fe6f61]">Modern</span> Property Management Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-2 border-[#D8D8D8] rounded-2xl flex flex-col md:flex-row items-center p-6 hover:shadow-lg transition-all hover:border-[#FE6F61]">
            <div className="flex flex-col gap-2 text-[#2A2A2A]">
              <p className="text-2xl md:text-3xl font-semibold">Digital Dashboard</p>
              <p className="text-sm">
                Manage all your properties, track rent payments, and handle maintenance requests in one place.
              </p>
              <button className="mt-4 bg-[#FE6F61] text-white py-2 px-4 rounded-md w-fit">Learn More</button>
            </div>
            <img
              alt="dashboard"
              src="/images/media/Partnership-bro 2.8d697706.svg"
              className="w-32 md:w-40 h-auto mt-4 md:mt-0 md:ml-auto"
            />
          </div>
          
          <div className="border-2 border-[#D8D8D8] rounded-2xl flex flex-col md:flex-row items-center p-6 hover:shadow-lg transition-all hover:border-[#FE6F61]">
            <div className="flex flex-col gap-2 text-[#2A2A2A]">
              <p className="text-2xl md:text-3xl font-semibold">Instant Alerts</p>
              <p className="text-sm">
                Get real-time notifications about new student inquiries, lease renewals, and payment reminders.
              </p>
              <button className="mt-4 bg-[#FE6F61] text-white py-2 px-4 rounded-md w-fit">Learn More</button>
            </div>
            <img
              alt="alerts"
              src="/images/media/Banknote-bro 1.4fa9193a.svg"
              className="w-32 md:w-40 h-auto mt-4 md:mt-0 md:ml-auto"
            />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-[#FEFBF2] px-4 md:px-8 lg:px-20 py-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl">
              What <span className="text-[#fe6f61]">landlords</span> say about us
            </h2>
            <p className="text-[#979797] font-medium text-sm md:text-base">
              Join our community of 500+ satisfied property owners across Delhi NCR
            </p>
          </div>

          <div className="relative group">
            <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
              ‹
            </button>
            
            <div className="flex overflow-x-auto gap-4 py-4 scrollbar-hide snap-x">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="snap-start flex-shrink-0 w-full sm:w-[280px]">
                  <Card className="border border-[#D8D8D8] bg-white h-full hover:shadow-md transition-shadow">
                    <div className="flex flex-col p-4 gap-3 h-full">
                      <p className="text-xs text-[#2A2A2A] line-clamp-5">
                        {testimonial.text}
                      </p>
                      <div className="flex justify-between mt-auto">
                        <div className="flex gap-3 items-center">
                          <img
                            alt="avatar"
                            src="/images/media/user_testimony.webp"
                            className="rounded-full h-8 w-8 object-cover"
                          />
                          <div>
                            <p className="text-lg font-semibold">
                              {testimonial.name}
                            </p>
                            <p className="text-[0.6rem] leading-none text-[#979797]">
                              {testimonial.property}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="font-semibold">{testimonial.rating}</p>
                          <img
                            alt="star"
                            src="/images/media/Star yellow.ba5bc4df.svg"
                            width="14"
                            height="14"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            
            <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Three Steps Section */}
      <div className="px-4 md:px-8 lg:px-20 py-16">
        <div className="flex flex-col gap-3 mb-8 text-center">
          <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl">
            List your property in{" "}
            <span className="text-[#fe6f61]">3 simple steps</span>
          </h2>
          <p className="text-[#979797] font-medium text-sm md:text-base">
            Quick and hassle-free onboarding process for landlords
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <div className="border rounded-xl p-4 flex flex-col gap-4 w-full h-full hover:shadow-md transition-shadow">
              <img
                alt="register"
                src="/images/media/File Check.webp"
                className="w-12 h-12"
              />
              <div className="flex flex-col gap-2">
                <span className="text-lg font-bold">Register & Verify</span>
                <span className="text-xs">
                  Create your account and complete the simple verification process
                </span>
              </div>
            </div>
            <img
              alt="arrow"
              src="/images/media/arrow.png"
              className="w-16 rotate-90 md:rotate-0 my-4 md:my-0"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <div className="border rounded-xl p-4 flex flex-col gap-4 w-full h-full hover:shadow-md transition-shadow">
              <img
                alt="details"
                src="/images/media/Minimalistic Magnifer.webp"
                className="w-12 h-12"
              />
              <div className="flex flex-col gap-2">
                <span className="text-lg font-bold">List Your Property</span>
                <span className="text-xs">
                  Add property details, photos, amenities and set your rental terms
                </span>
              </div>
            </div>
            <img
              alt="arrow"
              src="/images/media/arrow.png"
              className="w-16 rotate-90 md:rotate-0 my-4 md:my-0"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <div className="border rounded-xl p-4 flex flex-col gap-4 w-full h-full hover:shadow-md transition-shadow">
              <img
                alt="secured"
                src="/images/media/Home.webp"
                className="w-12 h-12"
              />
              <div className="flex flex-col gap-2">
                <span className="text-lg font-bold">
                  Start Receiving Inquiries
                </span>
                <span className="text-xs">
                  Get matched with verified students searching for accommodation near their campus
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#FE6F61] px-4 md:px-8 lg:px-20 py-12 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to maximize your rental income?</h2>
        <p className="mb-8 max-w-2xl mx-auto">Join hundreds of property owners who have increased their occupancy rates and simplified their property management with ROR</p>
        <button onClick={() => window.location.href = '/login'}   className="bg-white text-[#FE6F61] font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
          List Your Property Now
        </button>
      </div>

    </div>
  );
}