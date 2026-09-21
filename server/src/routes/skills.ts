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
    const { name, description, icon, badge, level, category, order } = req.body;

    if (!name || !description || !category) {
      res.status(400).json({
        error: "Missing required fields. name, description, and category are required.",
      });
      return;
    }

    try {
      const newSkill = new Skill({
        name,
        description,
        icon: icon || "Code",
        badge: badge || "Advanced",
        level: level !== undefined ? Number(level) : 90,
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
    const { name, description, icon, badge, level, category, order } = req.body;

    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (icon !== undefined) updateFields.icon = icon;
    if (badge !== undefined) updateFields.badge = badge;
    if (category !== undefined) updateFields.category = category;
    if (order !== undefined) updateFields.order = Number(order);
    if (level !== undefined) updateFields.level = Number(level);

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
