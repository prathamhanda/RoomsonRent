import React from "react";
import { motion } from "framer-motion";

const TenantCarousel = () => {
  // Mock data for tenants
  const tenants = [
    {
      id: 1,
      name: "John Doe",
      room: "Room 101", 
      status: "Current",
      rentDue: "₹7,500",
      moveOutDate: "30 May 2024",
      image: "/images/tenant1.jpg"
    },
    {
      id: 2,
      name: "Jane Smith",
      room: "Room 102",
      status: "Vacating", 
      rentDue: "₹8,200",
      moveOutDate: "15 Apr 2024",
      image: "/images/tenant2.jpg"
    },
    {
      id: 3,
      name: "Michael Johnson",
      room: "Room 201",
      status: "Current",
      rentDue: "₹9,000",
      moveOutDate: "10 Jun 2024",
      image: "/images/tenant1.jpg"
    },
    {
      id: 4,
      name: "Rajesh Kumar", 
      room: "Room 305",
      status: "Vacating",
      rentDue: "₹6,800",
      moveOutDate: "22 Apr 2024",
      image: "/images/tenant1.jpg"
    },
    {
      id: 5,
      name: "Robert Chen",
      room: "Room 401",
      status: "Current", 
      rentDue: "₹8,500",
      moveOutDate: "15 Jul 2024",
      image: "/images/tenant1.jpg"
    },
    {
      id: 6,
      name: "Emily Davis",
      room: "Room 203",
      status: "Vacating",
      rentDue: "₹7,200",
      moveOutDate: "30 Apr 2024", 
      image: "/images/tenant2.jpg"
    },
    {
      id: 7,
      name: "James Wilson",
      room: "Room 302",
      status: "Current",
      rentDue: "₹9,200",
      moveOutDate: "25 Jun 2024",
      image: "/images/tenant1.jpg"
    },
    {
      id: 8,
      name: "Maria Garcia",
      room: "Room 205",
      status: "Vacating",
      rentDue: "₹7,800",
      moveOutDate: "10 May 2024",
      image: "/images/tenant2.jpg"
    },
    {
      id: 9,
      name: "David Lee",
      room: "Room 402",
      status: "Current",
      rentDue: "₹8,900",
      moveOutDate: "20 Jul 2024",
      image: "/images/tenant1.jpg"
    },
    {
      id: 10,
      name: "Sophie Turner",
      room: "Room 301",
      status: "Current",
      rentDue: "₹7,600",
      moveOutDate: "05 Jun 2024",
      image: "/images/tenant2.jpg"
    },
    {
      id: 11,
      name: "William Smith",
      room: "Room 301",
      status: "Vacating",
      rentDue: "₹7,600",
      moveOutDate: "05 Jun 2024",
      image: "/images/tenant1.jpg"
    }
  ];

  const vacatingTenants = tenants.filter(tenant => tenant.status === "Vacating");
  const currentTenants = tenants.filter(tenant => tenant.status === "Current");

  const TenantSection = ({ title, tenants, statusColor, statusBgColor }) => (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold text-[#AE8549] mb-4">{title}</h3>
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 pb-4">
            {tenants.map((tenant) => (
              <motion.div
                key={tenant.id}
                className="flex-none w-[300px] bg-white rounded-xl p-4 shadow-sm border border-[#C59856]/20"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={tenant.image}
                    alt={tenant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">{tenant.name}</h4>
                    <p className="text-gray-500 text-sm">{tenant.room}</p>
                  </div>
                  <span 
                    className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${statusColor} ${statusBgColor}`}
                  >
                    {tenant.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Rent Due</p>
                    <p className="font-semibold">{tenant.rentDue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Move Out</p>
                    <p className="font-semibold">{tenant.moveOutDate}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-6">
      <TenantSection 
        title="Vacating Tenants" 
        tenants={vacatingTenants}
        statusColor="text-orange-600"
        statusBgColor="bg-orange-100"
      />
      <TenantSection 
        title="Current Tenants" 
        tenants={currentTenants}
        statusColor="text-green-600"
        statusBgColor="bg-green-100"
      />
    </div>
  );
};

export default TenantCarousel;
