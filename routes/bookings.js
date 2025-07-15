const express = require('express');
const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const User = require('../models/User');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const {
      venueId, 
      customerDetails,
      eventDetails,
      dateTime,
      pricing
    } = req.body;

    // For demo purposes, we'll create a booking without venue validation
    // In production, you would validate against actual venue data
    
    // Create a demo organizer ID (in real app, this would come from venue data)
    const demoOrganizerId = req.user.userId; // Using current user as organizer for demo

    // Create booking document
    const bookingData = {
      user: req.user.userId,
      venue: venueId || 'demo-venue-id',
      organizer: demoOrganizerId,
      customerDetails: {
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: customerDetails.address || '',
        city: customerDetails.city || '',
        state: customerDetails.state || ''
      },
      eventDetails: {
        title: eventDetails.title,
        eventType: eventDetails.eventType,
        expectedGuests: eventDetails.expectedGuests,
        specialRequirements: eventDetails.specialRequirements || ''
      },
      dateTime: {
        eventDate: new Date(dateTime.eventDate),
        startTime: dateTime.startTime,
        endTime: dateTime.endTime
      },
      pricing: {
        baseAmount: pricing.baseAmount,
        taxes: pricing.taxes,
        totalAmount: pricing.totalAmount,
        advanceAmount: pricing.advanceAmount,
        remainingAmount: pricing.remainingAmount
      },
      status: 'pending',
      paymentStatus: 'pending'
    };

    // Create booking
    const booking = new Booking(bookingData);
    await booking.save();

    // Get user details for email
    const user = await User.findById(req.user.userId);

    // Email to customer
    const customerEmailOptions = {
      from: process.env.EMAIL_USER,
      to: customerDetails.email,
      subject: 'Booking Request Submitted - EventHub',
      html: `
        <h2>Booking Request Submitted Successfully!</h2>
        <p>Dear ${customerDetails.name},</p>
        <p>Your booking request has been submitted and is waiting for organizer approval.</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Venue:</strong> ${venueId}</li>
          <li><strong>Event:</strong> ${eventDetails.title}</li>
          <li><strong>Date:</strong> ${new Date(dateTime.eventDate).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${dateTime.startTime} - ${dateTime.endTime}</li>
          <li><strong>Guests:</strong> ${eventDetails.expectedGuests}</li>
          <li><strong>Total Amount:</strong> ₹${pricing.totalAmount.toLocaleString()}</li>
        </ul>
        <p><strong>Status:</strong> Waiting for Approval</p>
        <p>You will receive a confirmation email once the organizer approves your booking.</p>
        <p>Thank you for choosing EventHub!</p>
      `
    };

    // Email to organizer
    const organizerEmailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email, // Demo: sending to same user
      subject: 'New Booking Request - EventHub',
      html: `
        <h2>New Booking Request Received!</h2>
        <p>Dear Organizer,</p>
        <p>You have received a new booking request for your venue.</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Venue:</strong> ${venueId}</li>
          <li><strong>Customer:</strong> ${customerDetails.name} (${customerDetails.email})</li>
          <li><strong>Event:</strong> ${eventDetails.title}</li>
          <li><strong>Date:</strong> ${new Date(dateTime.eventDate).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${dateTime.startTime} - ${dateTime.endTime}</li>
          <li><strong>Guests:</strong> ${eventDetails.expectedGuests}</li>
          <li><strong>Amount:</strong> ₹${pricing.totalAmount.toLocaleString()}</li>
        </ul>
        <p>Please log in to your dashboard to approve or reject this booking.</p>
        <p>EventHub Team</p>
      `
    };

    // Send emails (don't wait for them to complete)
    transporter.sendMail(customerEmailOptions).catch(console.error);
    transporter.sendMail(organizerEmailOptions).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully! Waiting for organizer approval.',
      booking: {
        id: booking._id,
        status: booking.status,
        totalAmount: pricing.totalAmount,
        venue: venueId,
        eventDate: dateTime.eventDate
      }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('venue', 'title images location')
      .populate('organizer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      bookings: bookings.map(booking => ({
        id: booking._id,
        venue: booking.venue,
        organizer: booking.organizer,
        eventDetails: booking.eventDetails,
        dateTime: booking.dateTime,
        pricing: booking.pricing,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt
      }))
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Update booking status (for organizers)
router.put('/:bookingId/status', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, message } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('user', 'name email')
      .populate('venue', 'title')
      .populate('organizer', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the organizer
    if (booking.organizer._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    
    // Add communication log
    booking.communication.push({
      from: req.user.userId,
      message: message || `Booking ${status}`,
      type: 'status_update'
    });

    await booking.save();

    // Send email notification to customer
    const statusMessages = {
      confirmed: 'Your booking has been confirmed!',
      rejected: 'Your booking has been rejected.',
      cancelled: 'Your booking has been cancelled.'
    };

    const emailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.user.email,
      subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - EventHub`,
      html: `
        <h2>${statusMessages[status]}</h2>
        <p>Dear ${booking.user.name},</p>
        <p>Your booking for <strong>${booking.venue.title}</strong> has been <strong>${status}</strong>.</p>
        ${message ? `<p><strong>Message from organizer:</strong> ${message}</p>` : ''}
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Event:</strong> ${booking.eventDetails.title}</li>
          <li><strong>Date:</strong> ${new Date(booking.dateTime.eventDate).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${booking.dateTime.startTime} - ${booking.dateTime.endTime}</li>
        </ul>
        ${status === 'confirmed' ? '<p>Please proceed with the payment to secure your booking.</p>' : ''}
        <p>Thank you for using EventHub!</p>
      `
    };

    transporter.sendMail(emailOptions).catch(console.error);

    res.json({
      message: `Booking ${status} successfully`,
      booking: {
        id: booking._id,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
});

module.exports = router;