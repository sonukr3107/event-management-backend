const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  venue: {
    type: String, // Changed to String for demo purposes
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerDetails: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: String,
    city: String,
    state: String
  },
  eventDetails: {
    title: {
      type: String,
      required: true
    },
    description: String,
    eventType: {
      type: String,
      required: true
    },
    expectedGuests: {
      type: Number,
      required: true
    },
    specialRequirements: String
  },
  dateTime: {
    eventDate: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    duration: Number // in hours
  },
  pricing: {
    baseAmount: {
      type: Number,
      required: true
    },
    additionalCharges: [{
      name: String,
      amount: Number
    }],
    taxes: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    advancePaid: {
      type: Number,
      default: 0
    },
    remainingAmount: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: [{
    amount: Number,
    method: String,
    transactionId: String,
    date: { type: Date, default: Date.now },
    status: String
  }],
  communication: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['message', 'status_update', 'payment_update'] }
  }],
  cancellation: {
    reason: String,
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: String
  },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    reviewDate: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ venue: 1, 'dateTime.eventDate': 1 });
bookingSchema.index({ organizer: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);