const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Wedding', 'Corporate', 'Birthday', 'Cultural', 'Religious', 'Sports', 'Conference', 'Other']
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true,
      default: 'Patna'
    },
    state: {
      type: String,
      required: true,
      default: 'Bihar'
    },
    pincode: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    landmarks: [String]
  },
  capacity: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    priceType: {
      type: String,
      enum: ['per_day', 'per_hour', 'per_event'],
      default: 'per_day'
    },
    additionalCharges: [{
      name: String,
      amount: Number,
      type: { type: String, enum: ['fixed', 'percentage'] }
    }]
  },
  amenities: [{
    name: String,
    available: { type: Boolean, default: true },
    charges: { type: Number, default: 0 }
  }],
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  availability: [{
    date: Date,
    isAvailable: { type: Boolean, default: true },
    timeSlots: [{
      startTime: String,
      endTime: String,
      isBooked: { type: Boolean, default: false }
    }]
  }],
  policies: {
    cancellation: String,
    advance: Number,
    terms: String
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false
  },
  totalBookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for location-based searches
venueSchema.index({ 'location.coordinates': '2dsphere' });
venueSchema.index({ category: 1, status: 1 });
venueSchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Venue', venueSchema);