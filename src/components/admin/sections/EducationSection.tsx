import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GraduationCap,
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
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
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
import { EducationItem } from "../types";

export default function EducationSection() {
  const { token, fetchWithAuth } = useAdminAuth();
  const queryClient = useQueryClient();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Dialog / form state
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] =
    useState<EducationItem | null>(null);
  const [eduYear, setEduYear] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduDesc, setEduDesc] = useState("");
  const [eduOrder, setEduOrder] = useState("0");
  const [eduFormError, setEduFormError] = useState<string | null>(null);

  // Fetch education query
  const educationQuery = useQuery<EducationItem[]>({
    queryKey: ["education", token],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/education`);
      if (!res.ok) throw new Error("Failed to load education list.");
      return res.json();
    },
    enabled: !!token,
  });

  // Education mutate mutation
  const educationMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id?: string;
      data: Omit<EducationItem, "_id">;
    }) => {
      const url = id
        ? `${apiUrl}/api/education/${id}`
        : `${apiUrl}/api/education`;
      const method = id ? "PUT" : "POST";
      const res = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save education.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      setIsEducationDialogOpen(false);
      resetEducationForm();
    },
  });

  // Delete education mutation
  const deleteEducationMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchWithAuth(`${apiUrl}/api/education/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete education.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });

  // Reorder education swap mutation
  const reorderEducationMutation = useMutation({
    mutationFn: async ({
      eduAId,
      orderA,
      eduBId,
      orderB,
    }: {
      eduAId: string;
      orderA: number;
      eduBId: string;
      orderB: number;
    }) => {
      const resA = await fetchWithAuth(`${apiUrl}/api/education/${eduAId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: orderA }),
      });
      if (!resA.ok)
        throw new Error("Failed to update order of first education entry.");

      const resB = await fetchWithAuth(`${apiUrl}/api/education/${eduBId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: orderB }),
      });
      if (!resB.ok)
        throw new Error("Failed to update order of second education entry.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });

  const resetEducationForm = () => {
    setEditingEducation(null);
    setEduYear("");
    setEduDegree("");
    setEduInstitution("");
    setEduDesc("");
    setEduOrder("0");
    setEduFormError(null);
  };

  const openEditEducation = (edu: EducationItem) => {
    setEditingEducation(edu);
    setEduYear(edu.year);
    setEduDegree(edu.degree);
    setEduInstitution(edu.institution);
    setEduDesc(edu.description);
    setEduOrder(String(edu.order));
    setEduFormError(null);
    setIsEducationDialogOpen(true);
  };

  const handleEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduYear || !eduDegree || !eduInstitution || !eduDesc) {
      setEduFormError("All fields except order are required.");
      return;
    }

    const data = {
      year: eduYear,
      degree: eduDegree,
      institution: eduInstitution,
      description: eduDesc,
      order: Number(eduOrder) || 0,
    };

    educationMutation.mutate({ id: editingEducation?._id, data });
  };

  const handleMoveEducation = (
    educationId: string,
    direction: "up" | "down",
  ) => {
    const sortedEdus = (educationQuery.data || []).sort(
      (a, b) => a.order - b.order || a.year.localeCompare(b.year),
    );

    const index = sortedEdus.findIndex((e) => e._id === educationId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedEdus.length) return;

    const eduA = sortedEdus[index];
    const eduB = sortedEdus[targetIndex];

    reorderEducationMutation.mutate({
      eduAId: eduA._id,
      orderA: targetIndex,
      eduBId: eduB._id,
      orderB: index,
    });
  };

  const { data: education = [], isLoading } = educationQuery;

  const sortedEducation = education.sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-soft shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Academic Journey
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage and structure your past and present educational
              qualifications
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => {
            resetEducationForm();
            setIsEducationDialogOpen(true);
          }}
          className="cursor-pointer bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Education
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card/20">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sortedEducation.length === 0 ? (
        <Card className="flex flex-col items-center justify-center text-center p-12 border-muted bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
          <div className="h-12 w-12 rounded-full bg-muted grid place-items-center mb-4 text-muted-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg font-bold">
            No education listed
          </CardTitle>
          <CardDescription className="max-w-xs mt-1 mb-5">
            Your academic timeline is empty. Click the button below to add your
            first education node.
          </CardDescription>
          <Button
            onClick={() => {
              resetEducationForm();
              setIsEducationDialogOpen(true);
            }}
            className="cursor-pointer"
          >
            Add first education
          </Button>
        </Card>
      ) : (
        <Card className="border-border bg-card/40 backdrop-blur-lg shadow-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[100px]">Order</TableHead>
                  <TableHead className="w-[120px]">Year</TableHead>
                  <TableHead className="w-[200px]">Degree / Program</TableHead>
                  <TableHead className="w-[200px]">Institution</TableHead>
                  <TableHead>Key Highlights</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEducation.map((edu, index) => (
                  <TableRow
                    key={edu._id}
                    className="border-border/60 hover:bg-muted/10 transition-colors group"
                  >
                    <TableCell className="align-middle">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-sm font-semibold text-muted-foreground w-4">
                          {edu.order}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveEducation(edu._id, "up")}
                            className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === sortedEducation.length - 1}
                            onClick={() => handleMoveEducation(edu._id, "down")}
                            className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <Badge className="bg-primary/20 text-foreground border border-primary/25 text-[10px]">
                        {edu.year}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-middle font-bold text-sm">
                      {edu.degree}
                    </TableCell>
                    <TableCell className="align-middle font-semibold text-xs text-primary">
                      {edu.institution}
                    </TableCell>
                    <TableCell className="align-top py-4 max-w-sm">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {edu.description}
                      </p>
                    </TableCell>
                    <TableCell className="align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditEducation(edu)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg cursor-pointer transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Education Entry?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the education at
                                "{edu.institution}
                                "? This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteEducationMutation.mutate(edu._id)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                              >
                                Delete Education
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Education Form Dialog */}
      <Dialog
        open={isEducationDialogOpen}
        onOpenChange={setIsEducationDialogOpen}
      >
        <DialogContent className="max-w-md rounded-2xl border-border bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingEducation ? "Edit Education" : "Add New Education"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Fill out the fields to document academic milestones.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEducationSubmit} className="space-y-4 mt-2">
            {eduFormError && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{eduFormError}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Degree / Program
                </label>
                <Input
                  value={eduDegree}
                  onChange={(e) => setEduDegree(e.target.value)}
                  placeholder="E.g. B.Sc. in Computer Science"
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Institution Name
                </label>
                <Input
                  value={eduInstitution}
                  onChange={(e) => setEduInstitution(e.target.value)}
                  placeholder="E.g. State University"
                  required
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Academic Year / Range
                </label>
                <Input
                  value={eduYear}
                  onChange={(e) => setEduYear(e.target.value)}
                  placeholder="E.g. 2021 – 2025"
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Sort Order
                </label>
                <Input
                  type="number"
                  value={eduOrder}
                  onChange={(e) => setEduOrder(e.target.value)}
                  placeholder="0"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Milestone Description
              </label>
              <Textarea
                value={eduDesc}
                onChange={(e) => setEduDesc(e.target.value)}
                placeholder="Major academic achievements, CGPA, theses..."
                rows={4}
                required
                className="rounded-xl"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEducationDialogOpen(false)}
                className="cursor-pointer rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300"
              >
                {educationMutation.isPending ? "Saving..." : "Save Education"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
