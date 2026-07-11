import { Router, Response } from "express";
import { Experience } from "../models/Experience";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// GET / - Public endpoint to retrieve all experiences
// Sorted by custom order ascending, then by createdAt descending
router.get("/", async (req, res: Response): Promise<void> => {
  try {
    const experiences = await Experience.find().sort({
      order: 1,
      createdAt: -1,
    });
    res.status(200).json(experiences);
  } catch (error) {
    console.error("Error fetching experience:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving experience." });
  }
});

// POST / - Protected endpoint to create a new experience
router.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { role, company, duration, current, description, order } = req.body;

    if (!role || !company || !duration || !description) {
      res.status(400).json({
        error:
          "Missing required fields. role, company, duration, and description are required.",
      });
      return;
    }

    try {
      const newExperience = new Experience({
        role,
        company,
        duration,
        current: current ?? false,
        description,
        order: order ?? 0,
      });

      const savedExperience = await newExperience.save();
      res.status(201).json(savedExperience);
    } catch (error) {
      console.error("Error creating experience:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the experience." });
    }
  },
);

// PUT /:id - Protected endpoint to update an experience
router.put(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { role, company, duration, current, description, order } = req.body;

    try {
      const updatedExperience = await Experience.findByIdAndUpdate(
        id,
        { role, company, duration, current, description, order },
        { new: true, runValidators: true },
      );

      if (!updatedExperience) {
        res.status(404).json({ error: "Experience not found." });
        return;
      }

      res.status(200).json(updatedExperience);
    } catch (error) {
      console.error("Error updating experience:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the experience." });
    }
  },
);

// DELETE /:id - Protected endpoint to delete an experience
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const deletedExperience = await Experience.findByIdAndDelete(id);

      if (!deletedExperience) {
        res.status(404).json({ error: "Experience not found." });
        return;
      }

      res.status(200).json({ message: "Experience deleted successfully." });
    } catch (error) {
      console.error("Error deleting experience:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the experience." });
    }
  },
);

export default router;
