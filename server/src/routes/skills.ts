import { Router, Response } from "express";
import { Skill } from "../models/Skill";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// GET / - Public endpoint to retrieve all skills
// Sorted by category ascending, then by order, and name ascending
router.get("/", async (req, res: Response): Promise<void> => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 });
    res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving skills." });
  }
});

// POST / - Protected endpoint to create a new skill
router.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, description, level, category, order } = req.body;

    if (!name || !description || level === undefined || !category) {
      res.status(400).json({
        error:
          "Missing required fields. name, description, level, and category are required.",
      });
      return;
    }

    const numericLevel = Number(level);
    if (isNaN(numericLevel) || numericLevel < 0 || numericLevel > 100) {
      res
        .status(400)
        .json({ error: "level field must be a number between 0 and 100." });
      return;
    }

    try {
      const newSkill = new Skill({
        name,
        description,
        level: numericLevel,
        category,
        order: order ?? 0,
      });

      const savedSkill = await newSkill.save();
      res.status(201).json(savedSkill);
    } catch (error) {
      console.error("Error creating skill:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the skill." });
    }
  },
);

// PUT /:id - Protected endpoint to update a skill
router.put(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, description, level, category, order } = req.body;

    const updateFields: any = { name, description, category, order };

    if (level !== undefined) {
      const numericLevel = Number(level);
      if (isNaN(numericLevel) || numericLevel < 0 || numericLevel > 100) {
        res
          .status(400)
          .json({ error: "level field must be a number between 0 and 100." });
        return;
      }
      updateFields.level = numericLevel;
    }

    try {
      const updatedSkill = await Skill.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      });

      if (!updatedSkill) {
        res.status(404).json({ error: "Skill not found." });
        return;
      }

      res.status(200).json(updatedSkill);
    } catch (error) {
      console.error("Error updating skill:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the skill." });
    }
  },
);

// DELETE /:id - Protected endpoint to delete a skill
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const deletedSkill = await Skill.findByIdAndDelete(id);

      if (!deletedSkill) {
        res.status(404).json({ error: "Skill not found." });
        return;
      }

      res.status(200).json({ message: "Skill deleted successfully." });
    } catch (error) {
      console.error("Error deleting skill:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the skill." });
    }
  },
);

export default router;
