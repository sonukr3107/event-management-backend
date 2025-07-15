const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const totalBookings = await Booking.countDocuments({ user: userId });
    const pendingBookings = await Booking.countDocuments({ user: userId, status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ user: userId, status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ user: userId, status: 'completed' });

    // Calculate total spent
    const spentResult = await Booking.aggregate([
      { $match: { user: userId, status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
    ]);
    const totalSpent = spentResult[0]?.total || 0;

    res.json({
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        totalSpent
      }
    });
  } catch (error) {
    console.error('User dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Get user's favorite venues (placeholder - would need favorites model)
router.get('/favorites', auth, async (req, res) => {
  try {
    // This is a placeholder - in a real app, you'd have a favorites model
    res.json({ favorites: [] });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

module.exports = router;