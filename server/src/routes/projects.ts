import { Router, Response } from 'express';
import { Project } from '../models/Project';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// GET / - Public endpoint to retrieve all projects
// Sorted by featured first (true before false), then by order ascending
router.get('/', async (req, res: Response): Promise<void> => {
  try {
    const projects = await Project.find().sort({ featured: -1, order: 1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'An error occurred while retrieving projects.' });
  }
});

// POST / - Protected endpoint to create a new project
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, image, tech, live, github, featured, order } = req.body;

  if (!title || !description || !image || !tech || !live || !github) {
    res.status(400).json({ error: 'Missing required fields. title, description, image, tech, live, and github are required.' });
    return;
  }

  if (!Array.isArray(tech)) {
    res.status(400).json({ error: 'tech field must be an array of strings.' });
    return;
  }

  try {
    const newProject = new Project({
      title,
      description,
      image,
      tech,
      live,
      github,
      featured: featured ?? false,
      order: order ?? 0
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'An error occurred while creating the project.' });
  }
});

// PUT /:id - Protected endpoint to update a project
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, image, tech, live, github, featured, order } = req.body;

  if (tech && !Array.isArray(tech)) {
    res.status(400).json({ error: 'tech field must be an array of strings.' });
    return;
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, description, image, tech, live, github, featured, order },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'An error occurred while updating the project.' });
  }
});

// DELETE /:id - Protected endpoint to delete a project
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'An error occurred while deleting the project.' });
  }
});

export default router;
