import { Router, Response } from 'express';
import { Profile } from '../models/Profile';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// GET / - Public endpoint to retrieve the singleton profile document
router.get('/', async (req, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      res.status(404).json({ error: 'Profile data not found. Please seed or configure the profile document.' });
      return;
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the profile.' });
  }
});

// PUT / - Protected endpoint to update or create the singleton profile document
router.put('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    name,
    fullName,
    roles,
    intro,
    availability,
    resumeUrl,
    homeImage,
    aboutImage,
    email,
    phone,
    phoneIntl,
    whatsapp,
    location,
    socials,
    aboutParagraphs,
    aboutTags,
    quickInfo
  } = req.body;

  if (
    !name ||
    !fullName ||
    !roles ||
    !intro ||
    !availability ||
    !resumeUrl ||
    !homeImage ||
    !aboutImage ||
    !email ||
    !phone ||
    !phoneIntl ||
    !whatsapp ||
    !location ||
    !socials ||
    !aboutParagraphs ||
    !aboutTags ||
    !quickInfo
  ) {
    res.status(400).json({ error: 'Missing required fields in request body.' });
    return;
  }

  try {
    // Perform upsert update for the singleton profile record
    const updatedProfile = await Profile.findOneAndUpdate(
      {}, // Match any profile
      {
        name,
        fullName,
        roles,
        intro,
        availability,
        resumeUrl,
        homeImage,
        aboutImage,
        email,
        phone,
        phoneIntl,
        whatsapp,
        location,
        socials,
        aboutParagraphs,
        aboutTags,
        quickInfo
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'An error occurred while updating the profile.' });
  }
});

export default router;
