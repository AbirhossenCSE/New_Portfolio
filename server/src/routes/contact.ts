import { Router, Response } from 'express';
import { Message } from '../models/Message';
import { contactRateLimiter } from '../middleware/rateLimiter';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Regular expression for validating email address format
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact - Public endpoint for submitting contact messages
// Applied rate limiter: max 5 requests per 15 minutes per IP
router.post('/', contactRateLimiter, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, message } = req.body;

  const errors: string[] = [];
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required and must be a non-empty string.');
  }
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }
  if (!message || typeof message !== 'string' || message.trim() === '') {
    errors.push('Message is required and must be a non-empty string.');
  }

  if (errors.length > 0) {
    res.status(400).json({ error: 'Validation failed', details: errors });
    return;
  }

  try {
    const newMessage = new Message({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date(),
      status: 'Unread'
    });

    const savedMessage = await newMessage.save();
    
    // Express response will trigger Message schema's toJSON/toObject transformations,
    // which strip out the internal __v property.
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'An error occurred while saving the message.' });
  }
});

// GET /api/contact - Protected endpoint, returns all messages sorted by createdAt descending
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'An error occurred while retrieving messages.' });
  }
});

// PUT /api/contact/:id/status - Protected endpoint, updates the status field
router.put('/:id/status', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || typeof status !== 'string' || !['Unread', 'Read', 'Important'].includes(status.trim())) {
    res.status(400).json({ error: 'Status is required and must be one of: Unread, Read, Important.' });
    return;
  }

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { status: status.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      res.status(404).json({ error: 'Message not found.' });
      return;
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'An error occurred while updating the message status.' });
  }
});

// DELETE /api/contact/:id - Protected endpoint, deletes a message
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      res.status(404).json({ error: 'Message not found.' });
      return;
    }

    res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'An error occurred while deleting the message.' });
  }
});

export default router;
