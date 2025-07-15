# EventHub Backend API

A comprehensive backend system for EventHub - Bihar's leading event management platform.

## 🚀 Features

- **User Authentication & Authorization** (JWT-based)
- **Role-based Access Control** (Admin, Organizer, User)
- **Venue Management System**
- **Booking Management with Email Notifications**
- **Location-based Search API** (Patna-focused)
- **AI Assistant API** (Rule-based recommendations)
- **Admin Dashboard with Analytics**
- **MongoDB Database with Mongoose ODM**

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email notifications)

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Configuration
Create a `.env` file in the server directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/eventhub
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/eventhub

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex

# Server
PORT=5000
NODE_ENV=development

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# OpenAI API Key (optional - for advanced AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/eventhub`

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and replace in `.env`
4. Whitelist your IP address

### 4. Seed Sample Data
```bash
npm run seed
```

This creates sample users and venues with these credentials:
- **Admin**: admin@eventhub.com / admin123
- **Organizer 1**: rajesh@eventhub.com / organizer123
- **Organizer 2**: priya@eventhub.com / organizer123
- **User**: amit@example.com / user123

### 5. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Venues
- `GET /api/venues` - Get all venues (with filters)
- `GET /api/venues/:id` - Get single venue
- `POST /api/venues` - Create venue (organizers only)
- `PUT /api/venues/:id` - Update venue
- `POST /api/venues/:id/reviews` - Add review

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Locations (Patna-focused)
- `GET /api/locations/search?query=marriage hall` - Search locations
- `GET /api/locations/suggestions?query=boring` - Get suggestions
- `GET /api/locations/popular` - Get popular locations

### AI Assistant
- `POST /api/ai-assistant/chat` - Chat with AI
- `POST /api/ai-assistant/recommendations` - Get AI recommendations

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Manage users
- `GET /api/admin/venues` - Manage venues
- `PUT /api/admin/venues/:id/status` - Approve/reject venues

### Organizer Routes
- `GET /api/organizers/dashboard` - Organizer dashboard
- `GET /api/organizers/venues` - Organizer's venues
- `GET /api/organizers/bookings` - Organizer's bookings

## 🗄️ Database Access

### Admin Database Access

#### Method 1: MongoDB Compass (GUI)
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MongoDB URI
3. Browse collections: `users`, `venues`, `bookings`

#### Method 2: MongoDB Shell
```bash
# Connect to local MongoDB
mongo eventhub

# Connect to Atlas
mongo "mongodb+srv://cluster.mongodb.net/eventhub" --username your_username

# Basic queries
db.users.find({role: "admin"})
db.venues.find({status: "pending"})
db.bookings.find({status: "confirmed"})
```

#### Method 3: Admin API Endpoints
Use the admin endpoints with admin authentication:
```javascript
// Get all users
GET /api/admin/users
Headers: { Authorization: "Bearer admin_jwt_token" }

// Get all venues
GET /api/admin/venues

// Get dashboard stats
GET /api/admin/dashboard
```

## 🔧 Frontend-Backend Connection

### 1. Update Frontend API Base URL
Create `src/config/api.js`:
```javascript
export const API_BASE_URL = 'http://localhost:5000/api';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return response.json();
};
```

### 2. Authentication Integration
```javascript
// Login function
export const login = async (email, password) => {
  const response = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }
  
  return response;
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
```

### 3. Location Search Integration
```javascript
// Search locations
export const searchLocations = async (query, filters = {}) => {
  const params = new URLSearchParams({ query, ...filters });
  return apiCall(`/locations/search?${params}`);
};

// Get suggestions
export const getLocationSuggestions = async (query) => {
  return apiCall(`/locations/suggestions?query=${query}`);
};
```

### 4. Booking Integration
```javascript
// Create booking
export const createBooking = async (bookingData) => {
  return apiCall('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
};

// Get user bookings
export const getUserBookings = async () => {
  return apiCall('/bookings/my-bookings');
};
```

### 5. AI Assistant Integration
```javascript
// Chat with AI
export const chatWithAI = async (message, conversationId) => {
  return apiCall('/ai-assistant/chat', {
    method: 'POST',
    body: JSON.stringify({ message, conversationId })
  });
};
```

## 📧 Email Notifications

The system sends automatic emails for:
- **Booking Confirmation** (to customer)
- **New Booking Alert** (to organizer)
- **Booking Status Updates** (approved/rejected)

### Gmail Setup for Email Notifications
1. Enable 2-factor authentication on Gmail
2. Generate App Password: Google Account → Security → App passwords
3. Use app password in `EMAIL_PASS` environment variable

## 🔒 Security Features

- **JWT Authentication** with 7-day expiry
- **Password Hashing** with bcrypt
- **Rate Limiting** (100 requests per 15 minutes)
- **CORS Protection**
- **Helmet.js** for security headers
- **Input Validation** with Mongoose schemas

## 📊 Booking Flow

1. **User searches** for venues using location API
2. **AI Assistant** provides recommendations
3. **User selects** venue and fills booking form
4. **System creates** booking with "pending" status
5. **Email sent** to both user and organizer
6. **Organizer approves/rejects** via dashboard
7. **Status update email** sent to user
8. **Payment processing** (if confirmed)

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Modern platform with good MongoDB support
- **DigitalOcean**: VPS with full control
- **AWS/GCP**: Enterprise-grade hosting

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB service is running
   - Verify connection string in `.env`
   - Check network connectivity for Atlas

2. **Email Not Sending**
   - Verify Gmail app password
   - Check EMAIL_* environment variables
   - Ensure 2FA is enabled on Gmail

3. **JWT Token Issues**
   - Check JWT_SECRET is set
   - Verify token format in frontend
   - Check token expiry

4. **CORS Errors**
   - Verify FRONTEND_URL in `.env`
   - Check CORS configuration in server.js

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check MongoDB connection
4. Verify environment variables

## 🎯 Next Steps

1. **Start the backend server**
2. **Test API endpoints** with Postman
3. **Connect frontend** to backend
4. **Test booking flow** end-to-end
5. **Deploy to production**

The backend is now ready to power your EventHub application! 🚀