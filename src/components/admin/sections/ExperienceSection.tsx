import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Plus,
  RefreshCw,
  Building2,
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
import { ExperienceItem } from "../types";

export default function ExperienceSection() {
  const { token, fetchWithAuth } = useAdminAuth();
  const queryClient = useQueryClient();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Dialog / form state
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<ExperienceItem | null>(null);
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDuration, setExpDuration] = useState("");
  const [expCurrent, setExpCurrent] = useState(false);
  const [expDesc, setExpDesc] = useState("");
  const [expOrder, setExpOrder] = useState("0");
  const [expFormError, setExpFormError] = useState<string | null>(null);

  // Fetch experience query
  const experienceQuery = useQuery<ExperienceItem[]>({
    queryKey: ["experiences", token],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/experience`);
      if (!res.ok) throw new Error("Failed to load experience.");
      return res.json();
    },
    enabled: !!token,
  });

  // Experience mutate mutation
  const experienceMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id?: string;
      data: Omit<ExperienceItem, "_id">;
    }) => {
      const url = id
        ? `${apiUrl}/api/experience/${id}`
        : `${apiUrl}/api/experience`;
      const method = id ? "PUT" : "POST";
      const res = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save experience.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      setIsExperienceDialogOpen(false);
      resetExperienceForm();
    },
  });

  // Delete experience mutation
  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchWithAuth(`${apiUrl}/api/experience/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete experience.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    },
  });

  const resetExperienceForm = () => {
    setEditingExperience(null);
    setExpRole("");
    setExpCompany("");
    setExpDuration("");
    setExpCurrent(false);
    setExpDesc("");
    setExpOrder("0");
    setExpFormError(null);
  };

  const openEditExperience = (e: ExperienceItem) => {
    setEditingExperience(e);
    setExpRole(e.role);
    setExpCompany(e.company);
    setExpDuration(e.duration);
    setExpCurrent(e.current);
    setExpDesc(e.description);
    setExpOrder(String(e.order));
    setExpFormError(null);
    setIsExperienceDialogOpen(true);
  };

  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole || !expCompany || !expDuration || !expDesc) {
      setExpFormError("Role, company, duration, and description are required.");
      return;
    }

    const data = {
      role: expRole,
      company: expCompany,
      duration: expDuration,
      current: expCurrent,
      description: expDesc,
      order: Number(expOrder) || 0,
    };

    experienceMutation.mutate({ id: editingExperience?._id, data });
  };

  const { data: experiences = [], isLoading } = experienceQuery;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-soft shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Work History</h2>
            <p className="text-sm text-muted-foreground">
              Manage and structure your past and present employment roles
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => {
            resetExperienceForm();
            setIsExperienceDialogOpen(true);
          }}
          className="cursor-pointer bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card/20">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : experiences.length === 0 ? (
        <Card className="flex flex-col items-center justify-center text-center p-12 border-muted bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
          <div className="h-12 w-12 rounded-full bg-muted grid place-items-center mb-4 text-muted-foreground">
            <Briefcase className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg font-bold">
            No experience listed
          </CardTitle>
          <CardDescription className="max-w-xs mt-1 mb-5">
            No employment history entries exist yet. Click the button below to
            add your first work history node.
          </CardDescription>
          <Button
            onClick={() => {
              resetExperienceForm();
              setIsExperienceDialogOpen(true);
            }}
            className="cursor-pointer"
          >
            Add first experience
          </Button>
        </Card>
      ) : (
        <Card className="border-border bg-card/40 backdrop-blur-lg shadow-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[80px]">Order</TableHead>
                  <TableHead className="w-[200px]">Company Name</TableHead>
                  <TableHead className="w-[180px]">Role Title</TableHead>
                  <TableHead className="w-[180px]">
                    Employment Duration
                  </TableHead>
                  <TableHead>Key Responsibilities</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiences.map((exp) => (
                  <TableRow
                    key={exp._id}
                    className="border-border/60 hover:bg-muted/10 transition-colors group"
                  >
                    <TableCell className="align-middle font-mono text-sm font-semibold text-muted-foreground">
                      {exp.order}
                    </TableCell>
                    <TableCell className="align-middle py-4">
                      <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-primary shrink-0" />
                        {exp.company}
                      </span>
                    </TableCell>
                    <TableCell className="align-middle font-semibold text-sm">
                      {exp.role}
                    </TableCell>
                    <TableCell className="align-middle text-xs font-medium">
                      <span className="inline-flex items-center gap-1.5 bg-muted/60 px-2 py-0.5 rounded-md border border-border/30 text-muted-foreground">
                        {exp.duration}
                        {exp.current && (
                          <Badge className="text-[9px] px-1.5 py-0 bg-accent/20 text-accent-foreground border-transparent">
                            Current
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="align-top py-4 max-w-sm">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {exp.description}
                      </p>
                    </TableCell>
                    <TableCell className="align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditExperience(exp)}
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
                                Delete Experience Entry?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete experience at "
                                {exp.company}"? This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteExperienceMutation.mutate(exp._id)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                              >
                                Delete Experience
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

      {/* Experience Form Dialog */}
      <Dialog
        open={isExperienceDialogOpen}
        onOpenChange={setIsExperienceDialogOpen}
      >
        <DialogContent className="max-w-md rounded-2xl border-border bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingExperience ? "Edit Experience" : "Add New Experience"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Fill out the fields to document a professional role.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExperienceSubmit} className="space-y-4 mt-2">
            {expFormError && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{expFormError}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Company
                </label>
                <Input
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  placeholder="E.g. Mindsynth Technology"
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Role / Title
                </label>
                <Input
                  value={expRole}
                  onChange={(e) => setExpRole(e.target.value)}
                  placeholder="E.g. Frontend Developer"
                  required
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Duration string
                </label>
                <Input
                  value={expDuration}
                  onChange={(e) => setExpDuration(e.target.value)}
                  placeholder="E.g. May 2025 – Present"
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
                  value={expOrder}
                  onChange={(e) => setExpOrder(e.target.value)}
                  placeholder="0"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="exp_current"
                checked={expCurrent}
                onChange={(e) => setExpCurrent(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="exp_current"
                className="text-xs font-medium text-foreground cursor-pointer select-none"
              >
                This is my current employment role
              </label>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Job Description
              </label>
              <Textarea
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                placeholder="Highlight your work and contributions..."
                rows={4}
                required
                className="rounded-xl"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExperienceDialogOpen(false)}
                className="cursor-pointer rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300"
              >
                {experienceMutation.isPending ? "Saving..." : "Save Experience"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
