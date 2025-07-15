const express = require('express');
const Venue = require('../models/Venue');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all venues with filters
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      city = 'Patna', 
      minCapacity, 
      maxCapacity, 
      minPrice, 
      maxPrice,
      page = 1,
      limit = 12,
      sort = 'rating'
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }
    
    if (minCapacity || maxCapacity) {
      filter['capacity.max'] = {};
      if (minCapacity) filter['capacity.max'].$gte = parseInt(minCapacity);
      if (maxCapacity) filter['capacity.max'].$lte = parseInt(maxCapacity);
    }
    
    if (minPrice || maxPrice) {
      filter['pricing.basePrice'] = {};
      if (minPrice) filter['pricing.basePrice'].$gte = parseInt(minPrice);
      if (maxPrice) filter['pricing.basePrice'].$lte = parseInt(maxPrice);
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price_low':
        sortOption = { 'pricing.basePrice': 1 };
        break;
      case 'price_high':
        sortOption = { 'pricing.basePrice': -1 };
        break;
      case 'rating':
        sortOption = { 'rating.average': -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { 'rating.average': -1 };
    }

    const venues = await Venue.find(filter)
      .populate('organizer', 'name email phone rating')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Venue.countDocuments(filter);

    res.json({
      venues,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get venues error:', error);
    res.status(500).json({ message: 'Error fetching venues' });
  }
});

// Get single venue
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id)
      .populate('organizer', 'name email phone rating')
      .populate('reviews.user', 'name avatar');

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json(venue);
  } catch (error) {
    console.error('Get venue error:', error);
    res.status(500).json({ message: 'Error fetching venue' });
  }
});

// Create venue (organizers only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only organizers can create venues' });
    }

    const venueData = {
      ...req.body,
      organizer: req.user.userId
    };

    const venue = new Venue(venueData);
    await venue.save();

    res.status(201).json({
      message: 'Venue created successfully',
      venue
    });
  } catch (error) {
    console.error('Create venue error:', error);
    res.status(500).json({ message: 'Error creating venue' });
  }
});

// Update venue
router.put('/:id', auth, async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Check if user is the organizer or admin
    if (venue.organizer.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this venue' });
    }

    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Venue updated successfully',
      venue: updatedVenue
    });
  } catch (error) {
    console.error('Update venue error:', error);
    res.status(500).json({ message: 'Error updating venue' });
  }
});

// Add review
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Check if user already reviewed
    const existingReview = venue.reviews.find(
      review => review.user.toString() === req.user.userId
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this venue' });
    }

    // Add review
    venue.reviews.push({
      user: req.user.userId,
      rating,
      comment
    });

    // Update average rating
    const totalRating = venue.reviews.reduce((sum, review) => sum + review.rating, 0);
    venue.rating.average = totalRating / venue.reviews.length;
    venue.rating.count = venue.reviews.length;

    await venue.save();

    res.json({
      message: 'Review added successfully',
      rating: venue.rating
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Error adding review' });
  }
});

module.exports = router;