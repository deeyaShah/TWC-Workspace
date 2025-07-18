import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import SlotBooking from '../Models/SlotBooking.js';
import User from '../Models/users.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  // Book a slot
  router.post('/book', authMiddleware, async (req, res) => {
    try {
      const { name, email, phone, date, timeSlot } = req.body;
      const existing = await SlotBooking.findOne({ date, timeSlot, status: 'Accepted' });
      if (existing) return res.status(400).json({ message: 'Slot already booked!' });
  
      const booking = new SlotBooking({
        userId: req.user.id,
        name,
        email,
        phone,
        date,
        timeSlot,
      });
      await booking.save();
      res.status(201).json({ message: 'Slot booked. Awaiting confirmation.' });
    } catch (err) {
      res.status(500).json({ message: 'Server error.' });
    }
  });
  
  // Get all bookings (admin)
  router.get('/admin/all', async (req, res) => {
    try {
      const bookings = await SlotBooking.find().sort({ createdAt: -1 });
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching bookings' });
    }
  });
  
  // Accept slot (admin)
  router.put('/admin/accept/:id', async (req, res) => {
    try {
      const booking = await SlotBooking.findByIdAndUpdate(req.params.id, { status: 'Accepted' }, { new: true });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: 'Slot Booking Confirmed',
        text: `Your slot on ${booking.date} at ${booking.timeSlot} has been confirmed.`,
      };
      transporter.sendMail(mailOptions);
      res.json({ message: 'Slot accepted and email sent.' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to accept booking' });
    }
  });
  
  // Suggest new time (admin)
  router.put('/admin/suggest/:id', async (req, res) => {
    try {
      const { suggestedTime } = req.body;
      const booking = await SlotBooking.findByIdAndUpdate(req.params.id, { status: `Suggested: ${suggestedTime}`, suggestedTime }, { new: true });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.email,
        subject: 'Slot Booking Suggestion',
        text: `Your selected slot is unavailable. Suggested time: ${suggestedTime}.`,
      };
      transporter.sendMail(mailOptions);
      res.json({ message: 'Time suggested and email sent.' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to suggest time' });
    }
  });
  
  // Delete suspicious
  router.delete('/admin/delete/:id', async (req, res) => {
    try {
      await SlotBooking.findByIdAndDelete(req.params.id);
      res.json({ message: 'Booking deleted.' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete booking' });
    }
  });

export default router;