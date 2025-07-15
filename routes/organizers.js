const express = require('express');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();

// Get organizer dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Access denied. Organizers only.' });
    }

    const organizerId = req.user.userId;

    // Get organizer's venues
    const totalVenues = await Venue.countDocuments({ organizer: organizerId });
    const activeVenues = await Venue.countDocuments({ organizer: organizerId, status: 'active' });
    
    // Get bookings for organizer's venues
    const totalBookings = await Booking.countDocuments({ organizer: organizerId });
    const pendingBookings = await Booking.countDocuments({ organizer: organizerId, status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ organizer: organizerId, status: 'confirmed' });

    // Calculate revenue
    const revenueResult = await Booking.aggregate([
      { $match: { organizer: organizerId, status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Monthly stats
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyBookings = await Booking.countDocuments({
      organizer: organizerId,
      createdAt: { $gte: currentMonth }
    });

    const monthlyRevenue = await Booking.aggregate([
      { 
        $match: { 
          organizer: organizerId,
          status: 'confirmed',
          createdAt: { $gte: currentMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
    ]);

    res.json({
      stats: {
        totalVenues,
        activeVenues,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalRevenue,
        monthlyBookings,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Organizer dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Get organizer's venues
router.get('/venues', auth, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Access denied. Organizers only.' });
    }

    const venues = await Venue.find({ organizer: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ venues });
  } catch (error) {
    console.error('Get organizer venues error:', error);
    res.status(500).json({ message: 'Error fetching venues' });
  }
});

// Get organizer's bookings
router.get('/bookings', auth, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Access denied. Organizers only.' });
    }

    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { organizer: req.user.userId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('venue', 'title location images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get organizer bookings error:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

module.exports = router;