import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Layers,
  Plus,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminAuth } from "../AdminAuthContext";
import { SkillItem } from "../types";

const DEFAULT_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database & ORM",
  "Tools",
  "Deployment",
];

const categoryOrderList = [
  "Frontend",
  "Backend",
  "Database & ORM",
  "Tools",
  "Deployment",
];

export default function SkillsSection() {
  const { token, fetchWithAuth } = useAdminAuth();
  const queryClient = useQueryClient();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Dialog / form state
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [skillName, setSkillName] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillLevel, setSkillLevel] = useState("80");
  const [skillCategory, setSkillCategory] = useState("Frontend");
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [skillOrder, setSkillOrder] = useState("0");
  const [skillFormError, setSkillFormError] = useState<string | null>(null);

  // Fetch skills query
  const skillsQuery = useQuery<SkillItem[]>({
    queryKey: ["skills", token],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/skills`);
      if (!res.ok) throw new Error("Failed to load skills.");
      return res.json();
    },
    enabled: !!token,
  });

  // Skill mutate mutation
  const skillMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id?: string;
      data: Omit<SkillItem, "_id">;
    }) => {
      const url = id ? `${apiUrl}/api/skills/${id}` : `${apiUrl}/api/skills`;
      const method = id ? "PUT" : "POST";
      const res = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save skill.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setIsSkillDialogOpen(false);
      resetSkillForm();
    },
  });

  // Reorder skill swap mutation
  const reorderSkillMutation = useMutation({
    mutationFn: async ({
      skillAId,
      orderA,
      skillBId,
      orderB,
    }: {
      skillAId: string;
      orderA: number;
      skillBId: string;
      orderB: number;
    }) => {
      const resA = await fetchWithAuth(`${apiUrl}/api/skills/${skillAId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: orderA }),
      });
      if (!resA.ok) throw new Error("Failed to update order of first skill.");

      const resB = await fetchWithAuth(`${apiUrl}/api/skills/${skillBId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: orderB }),
      });
      if (!resB.ok) throw new Error("Failed to update order of second skill.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  // Delete skill mutation
  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchWithAuth(`${apiUrl}/api/skills/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete skill.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const resetSkillForm = () => {
    setEditingSkill(null);
    setSkillName("");
    setSkillDesc("");
    setSkillLevel("80");
    setSkillCategory(DEFAULT_CATEGORIES[0]);
    setUseCustomCategory(false);
    setCustomCategoryName("");
    setSkillOrder("0");
    setSkillFormError(null);
  };

  const openEditSkill = (s: SkillItem) => {
    setEditingSkill(s);
    setSkillName(s.name);
    setSkillDesc(s.description);
    setSkillLevel(String(s.level));
    setSkillOrder(String(s.order));
    setSkillFormError(null);

    if (DEFAULT_CATEGORIES.includes(s.category)) {
      setSkillCategory(s.category);
      setUseCustomCategory(false);
    } else {
      setUseCustomCategory(true);
      setCustomCategoryName(s.category);
      setSkillCategory("");
    }
    setIsSkillDialogOpen(true);
  };

  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = useCustomCategory
      ? customCategoryName.trim()
      : skillCategory;

    if (!skillName || !skillDesc || !finalCategory) {
      setSkillFormError("Name, description, and category are required.");
      return;
    }

    const numericLevel = Number(skillLevel);
    if (isNaN(numericLevel) || numericLevel < 0 || numericLevel > 100) {
      setSkillFormError("Level must be a number between 0 and 100.");
      return;
    }

    const data = {
      name: skillName,
      description: skillDesc,
      level: numericLevel,
      category: finalCategory,
      order: Number(skillOrder) || 0,
    };

    skillMutation.mutate({ id: editingSkill?._id, data });
  };

  const handleMoveSkill = (
    categoryName: string,
    skillId: string,
    direction: "up" | "down",
  ) => {
    const categorySkills = (skillsQuery.data || [])
      .filter((s) => s.category === categoryName)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

    const index = categorySkills.findIndex((s) => s._id === skillId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categorySkills.length) return;

    const skillA = categorySkills[index];
    const skillB = categorySkills[targetIndex];

    reorderSkillMutation.mutate({
      skillAId: skillA._id,
      orderA: targetIndex,
      skillBId: skillB._id,
      orderB: index,
    });
  };

  const { data: skills = [], isLoading } = skillsQuery;

  // Group skills by category dynamically
  const groupedSkills = skills.reduce<Record<string, SkillItem[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  // Order category keys
  const sortedCategoryKeys = Object.keys(groupedSkills).sort((a, b) => {
    const idxA = categoryOrderList.indexOf(a);
    const idxB = categoryOrderList.indexOf(b);
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-soft shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Skills Database
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage technical categories, specific toolsets, and order items
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => {
            resetSkillForm();
            setIsSkillDialogOpen(true);
          }}
          className="cursor-pointer bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card/20">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : skills.length === 0 ? (
        <Card className="flex flex-col items-center justify-center text-center p-12 border-muted bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
          <div className="h-12 w-12 rounded-full bg-muted grid place-items-center mb-4 text-muted-foreground">
            <Layers className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg font-bold">No skills listed</CardTitle>
          <CardDescription className="max-w-xs mt-1 mb-5">
            Your toolbox is currently empty. Click the button below to add your
            first technical skill.
          </CardDescription>
          <Button
            onClick={() => {
              resetSkillForm();
              setIsSkillDialogOpen(true);
            }}
            className="cursor-pointer"
          >
            Add first skill
          </Button>
        </Card>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={sortedCategoryKeys}
          className="space-y-4"
        >
          {sortedCategoryKeys.map((categoryName) => {
            const categorySkills = groupedSkills[categoryName].sort(
              (a, b) => a.order - b.order || a.name.localeCompare(b.name),
            );
            return (
              <AccordionItem
                key={categoryName}
                value={categoryName}
                className="border border-border bg-card/30 backdrop-blur-md shadow-soft rounded-2xl overflow-hidden px-4 md:px-6"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-foreground">
                      {categoryName}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-2 py-0.5 text-muted-foreground bg-muted/40 font-mono"
                    >
                      {categorySkills.length} skill
                      {categorySkills.length === 1 ? "" : "s"}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-2">
                  <div className="space-y-2">
                    {categorySkills.map((skill, index) => (
                      <div
                        key={skill._id}
                        className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/40 hover:bg-muted/10 transition-colors duration-200 group"
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className="flex flex-col gap-0.5 shrink-0">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() =>
                                handleMoveSkill(categoryName, skill._id, "up")
                              }
                              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              disabled={index === categorySkills.length - 1}
                              onClick={() =>
                                handleMoveSkill(categoryName, skill._id, "down")
                              }
                              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-sm text-foreground">
                                {skill.name}
                              </span>
                              <span className="text-[10px] font-semibold text-primary/80">
                                {skill.level}% Proficiency
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1 break-words">
                              {skill.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditSkill(skill)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/65 rounded-lg cursor-pointer"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Skill?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the skill "
                                  {skill.name}"? This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    deleteSkillMutation.mutate(skill._id)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {/* Skill Form Dialog */}
      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingSkill ? "Edit Skill" : "Add New Skill"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Fill out the fields to add a skill to your toolkit.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSkillSubmit} className="space-y-4 mt-2">
            {skillFormError && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{skillFormError}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Skill Name
                </label>
                <Input
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="E.g. TypeScript"
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Proficiency (0-100%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            {useCustomCategory ? (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Custom Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCustomCategory(false)}
                    className="text-[10px] text-primary hover:underline cursor-pointer"
                  >
                    Choose existing
                  </button>
                </div>
                <Input
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  placeholder="E.g. Native Mobile Apps"
                  required
                  className="rounded-xl"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseCustomCategory(true)}
                      className="text-[10px] text-primary hover:underline cursor-pointer"
                    >
                      Type custom
                    </button>
                  </div>
                  <Select
                    value={skillCategory}
                    onValueChange={setSkillCategory}
                  >
                    <SelectTrigger className="w-full h-9 cursor-pointer rounded-xl">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        new Set([
                          ...DEFAULT_CATEGORIES,
                          ...skills.map((s) => s.category),
                        ]),
                      ).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Sort Order
                  </label>
                  <Input
                    type="number"
                    value={skillOrder}
                    onChange={(e) => setSkillOrder(e.target.value)}
                    placeholder="0"
                    className="rounded-xl"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Brief Description
              </label>
              <Textarea
                value={skillDesc}
                onChange={(e) => setSkillDesc(e.target.value)}
                placeholder="E.g. Code safety and type definitions..."
                rows={2}
                required
                className="rounded-xl"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSkillDialogOpen(false)}
                className="cursor-pointer rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300"
              >
                {skillMutation.isPending ? "Saving..." : "Save Skill"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
