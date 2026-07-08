import { Router, Response } from 'express';
import { Education } from '../models/Education';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// GET / - Public endpoint to retrieve all education nodes
// Sorted by order ascending, then by year descending
router.get('/', async (req, res: Response): Promise<void> => {
  try {
    const education = await Education.find().sort({ order: 1, year: -1 });
    res.status(200).json(education);
  } catch (error) {
    console.error('Error fetching education:', error);
    res.status(500).json({ error: 'An error occurred while retrieving education.' });
  }
});

// POST / - Protected endpoint to create a new education node
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { year, degree, institution, description, order } = req.body;

  if (!year || !degree || !institution || !description) {
    res.status(400).json({ error: 'Missing required fields. year, degree, institution, and description are required.' });
    return;
  }

  try {
    const newEducation = new Education({
      year,
      degree,
      institution,
      description,
      order: order ?? 0
    });

    const savedEducation = await newEducation.save();
    res.status(201).json(savedEducation);
  } catch (error) {
    console.error('Error creating education:', error);
    res.status(500).json({ error: 'An error occurred while creating the education entry.' });
  }
});

// PUT /:id - Protected endpoint to update an education node
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { year, degree, institution, description, order } = req.body;

  try {
    const updatedEducation = await Education.findByIdAndUpdate(
      id,
      { year, degree, institution, description, order },
      { new: true, runValidators: true }
    );

    if (!updatedEducation) {
      res.status(404).json({ error: 'Education entry not found.' });
      return;
    }

    res.status(200).json(updatedEducation);
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(500).json({ error: 'An error occurred while updating the education entry.' });
  }
});

// DELETE /:id - Protected endpoint to delete an education node
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedEducation = await Education.findByIdAndDelete(id);

    if (!deletedEducation) {
      res.status(404).json({ error: 'Education entry not found.' });
      return;
    }

    res.status(200).json({ message: 'Education entry deleted successfully.' });
  } catch (error) {
    console.error('Error deleting education:', error);
    res.status(500).json({ error: 'An error occurred while deleting the education entry.' });
  }
});

export default router;
