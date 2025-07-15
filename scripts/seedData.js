const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Venue = require('../models/Venue');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Venue.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@eventhub.com',
      phone: '+91 9999999999',
      password: adminPassword,
      role: 'admin',
      isVerified: true
    });
    await admin.save();

    // Create sample organizers
    const organizer1Password = await bcrypt.hash('organizer123', 10);
    const organizer1 = new User({
      name: 'Rajesh Kumar',
      email: 'rajesh@eventhub.com',
      phone: '+91 9876543210',
      password: organizer1Password,
      role: 'organizer',
      isVerified: true
    });
    await organizer1.save();

    const organizer2Password = await bcrypt.hash('organizer123', 10);
    const organizer2 = new User({
      name: 'Priya Sharma',
      email: 'priya@eventhub.com',
      phone: '+91 9876543211',
      password: organizer2Password,
      role: 'organizer',
      isVerified: true
    });
    await organizer2.save();

    // Create sample user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = new User({
      name: 'Amit Singh',
      email: 'amit@example.com',
      phone: '+91 9876543212',
      password: userPassword,
      role: 'user',
      isVerified: true
    });
    await user.save();

    // Create sample venues
    const venues = [
      {
        title: 'Royal Palace Banquet',
        description: 'Luxurious banquet hall perfect for weddings and grand celebrations',
        organizer: organizer1._id,
        category: 'Wedding',
        location: {
          address: 'Fraser Road, Near Gandhi Maidan',
          city: 'Patna',
          state: 'Bihar',
          pincode: '800001',
          coordinates: { latitude: 25.6093, longitude: 85.1376 }
        },
        capacity: { min: 300, max: 800 },
        pricing: { basePrice: 25000, currency: 'INR', priceType: 'per_day' },
        amenities: [
          { name: 'Air Conditioning', available: true },
          { name: 'Sound System', available: true },
          { name: 'Catering Service', available: true },
          { name: 'Parking', available: true }
        ],
        images: [
          { url: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg', isPrimary: true }
        ],
        status: 'active',
        rating: { average: 4.7, count: 23 }
      },
      {
        title: 'Business Hub Conference Center',
        description: 'Modern conference center with latest technology for corporate events',
        organizer: organizer2._id,
        category: 'Corporate',
        location: {
          address: 'Boring Road, Near AIIMS',
          city: 'Patna',
          state: 'Bihar',
          pincode: '800013',
          coordinates: { latitude: 25.5941, longitude: 85.1376 }
        },
        capacity: { min: 50, max: 200 },
        pricing: { basePrice: 12000, currency: 'INR', priceType: 'per_day' },
        amenities: [
          { name: 'Projector', available: true },
          { name: 'WiFi', available: true },
          { name: 'Coffee Service', available: true },
          { name: 'Parking', available: true }
        ],
        images: [
          { url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', isPrimary: true }
        ],
        status: 'active',
        rating: { average: 4.6, count: 15 }
      },
      {
        title: 'Diamond Marriage Garden',
        description: 'Beautiful outdoor garden venue for traditional weddings',
        organizer: organizer1._id,
        category: 'Wedding',
        location: {
          address: 'Danapur Cantonment',
          city: 'Patna',
          state: 'Bihar',
          pincode: '801503',
          coordinates: { latitude: 25.6298, longitude: 85.0464 }
        },
        capacity: { min: 500, max: 1000 },
        pricing: { basePrice: 35000, currency: 'INR', priceType: 'per_day' },
        amenities: [
          { name: 'Garden Setting', available: true },
          { name: 'Mandap Setup', available: true },
          { name: 'Catering Kitchen', available: true },
          { name: 'Guest Rooms', available: true }
        ],
        images: [
          { url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg', isPrimary: true }
        ],
        status: 'active',
        rating: { average: 4.8, count: 31 }
      }
    ];

    await Venue.insertMany(venues);

    console.log('✅ Sample data created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('Admin: admin@eventhub.com / admin123');
    console.log('Organizer 1: rajesh@eventhub.com / organizer123');
    console.log('Organizer 2: priya@eventhub.com / organizer123');
    console.log('User: amit@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();