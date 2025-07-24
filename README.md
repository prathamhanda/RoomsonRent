# RoomsonRent - Student Housing Platform

RoomsonRent is a comprehensive platform designed to solve the critical challenge of finding quality student housing near educational institutions. Focusing primarily on the Delhi college market, this platform connects students with suitable accommodations while helping landlords efficiently manage their rental properties.

| CLIENT SIDE | LANDLORD SIDE |
|-------------|---------------|
| [![Client Side Video](https://res.cloudinary.com/dglcgpley/image/upload/v1751450380/banner_fl8pva.png)](https://res.cloudinary.com/dglcgpley/video/upload/v1753264134/client_side_online-video-cutter.com_td61tc.mp4) | [![Landlord Side Video](https://res.cloudinary.com/dglcgpley/image/upload/v1753264586/preivew_jfekhm.png)](https://res.cloudinary.com/dglcgpley/video/upload/v1753264232/landlord_side_online-video-cutter.com_p5j24q.mp4) |

> 🔗 Click on the thumbnails above to watch the demo videos.

---

## 📊 Market Overview



### The Problem
College students face significant challenges finding safe, affordable housing near their educational institutions. The traditional housing search process is fragmented, time-consuming, and often leads to suboptimal living situations that affect academic performance.

### Our Solution
RoomsonRent bridges this gap by creating a centralized platform specifically designed for student housing needs. We connect students from over 70 Delhi colleges with verified accommodations nearby, simplifying the entire process from search to move-in.

## 🌟 Features

### For Students
- **College-Based Search**: Find accommodations near 70+ Delhi colleges and educational institutions
- **Location-Aware Recommendations**: Get personalized property suggestions based on proximity to your college
- **Distance Calculation**: See exactly how far each property is from your educational institution
- **Advanced Filtering**: Filter by rent, amenities, room type, and occupancy options
- **Detailed Property Listings**: High-quality images, comprehensive descriptions, and available amenities
- **Booking Management**: Schedule viewings and manage rental applications with ease
- **Verified Reviews**: Read authentic feedback from other students who have lived in the properties
- **Budget Options**: Choose from both regular and premium accommodations to match your budget

### For Landlords
- **Student-Focused Listing Tools**: Showcase your properties to the right audience of college students
- **College Proximity Highlight**: Automatically show students how close your property is to their institution
- **Property Management Dashboard**: Easily add, edit, and manage multiple listings
- **Booking Oversight**: Process booking requests and communicate with potential student tenants
- **Image Management**: Upload and organize property photos with Cloudinary integration
- **Analytics Tools**: Track listing performance and visitor engagement metrics
- **Tenant Verification**: Review student applications including college information
- **WhatsApp Integration**: Direct communication with student tenants for faster responses

## Target Market & Opportunity

### Total Addressable Market (TAM)
- **Delhi NCR Student Population**: Over 500,000 students enrolled in 70+ colleges and universities
- **Annual Housing Need**: Approximately 300,000 students seeking off-campus accommodations each year
- **Market Value**: ₹9,000 Cr+ ($1.1B+) annual student housing market in Delhi NCR region

### Key Market Segments
- **Undergraduate Students**: First-time renters looking for affordable shared accommodations
- **Postgraduate Students**: Seeking quality housing with study-friendly environments
- **International Students**: Requiring verified, safe housing options with additional amenities
- **Short-term Program Students**: Needing flexible rental terms for internships and short courses

### Competitive Advantage
- **College-Specific Focus**: Direct targeting of housing needs around specific institutions
- **Verification System**: All properties and landlords undergo a verification process
- **End-to-End Solution**: From property discovery to booking confirmation and ongoing management
- **Transparency**: Clear pricing, no hidden fees, and authentic student reviews.

## 🛠️ Technology Stack

### Backend
- **Node.js & Express**: RESTful API architecture
- **MongoDB**: NoSQL database for flexible data storage
- **JWT Authentication**: Secure user authentication and authorization
- **Cloudinary API**: Cloud-based image storage and manipulation
- **WhatsApp Business API**: Integrated messaging capabilities
- **Email Services**: Automated notifications and communications

### Frontend
- **React**: Component-based UI development
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **React Context API**: State management
- **Mapbox/Leaflet**: Interactive mapping functionality
- **Responsive Design**: Seamless experience across all devices

### DevOps & Tooling
- **Docker**: Containerized development and deployment
- **CI/CD Pipeline**: Automated testing and deployment
- **Git Version Control**: Collaborative development workflow

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or later)
- MongoDB (local or Atlas)
- Cloudinary account
- WhatsApp Business API access (optional)

### Environment Configuration

Before running the application, you need to set up the environment configuration:

1. Navigate to the `backend/config` directory
2. Copy the `config.env.example` file to `config.env`
3. Fill in your credentials in the `config.env` file:
   - MongoDB connection string
   - JWT secret
   - Cloudinary credentials
   - SMTP email settings
   - Other required environment variables

Example:
```bash
# Copy the example config
cp backend/config/config.env.example backend/config/config.env

# Edit the config file with your credentials
nano backend/config/config.env
```

### Installation & Setup

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend_main
npm install
npm run dev
```

#### Landlord Dashboard
```bash
cd frontend_landlord
npm install
npm run dev
```

## 📊 Project Structure

```
RoomsonRent/
├── backend/               # Main API server
│   ├── controllers/       # Request handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Custom middlewares
│   └── config/            # Configuration files
├── backend_wa/            # WhatsApp integration service
├── frontend_main/         # Tenant-facing application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application views
│   │   └── context/       # State management
└── frontend_landlord/     # Landlord dashboard
```

## 🔒 Security Note

The `config.env` file contains sensitive information and should never be committed to version control. It is included in the `.gitignore` file to prevent accidental commits.

## 🌟 Impact & Vision

RoomsonRent aims to transform the student housing experience in India, starting with the Delhi NCR region. By solving the critical housing challenges faced by students, we're contributing to better academic outcomes, reduced stress, and improved quality of life for the student community.

Our long-term vision includes:
- Expanding to all major educational hubs across India
- Building partnerships with educational institutions for official housing recommendations
- Creating a comprehensive support system for first-time student renters
- Developing additional services like roommate matching and bill splitting
- Establishing the largest verified student housing database in India

Join us in revolutionizing student housing in India!
