import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Code,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  ExternalLink,
  Github,
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
import { ProjectItem } from "../types";

export default function ProjectsSection() {
  const { token, fetchWithAuth } = useAdminAuth();
  const queryClient = useQueryClient();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Dialog / form state
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(
    null,
  );
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectImage, setProjectImage] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [projectLive, setProjectLive] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectFeatured, setProjectFeatured] = useState(false);
  const [projectOrder, setProjectOrder] = useState("0");
  const [projectFormError, setProjectFormError] = useState<string | null>(null);

  // Fetch projects query
  const projectsQuery = useQuery<ProjectItem[]>({
    queryKey: ["projects", token],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/projects`);
      if (!res.ok) throw new Error("Failed to load projects.");
      return res.json();
    },
    enabled: !!token,
  });

  // Project mutate mutation
  const projectMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id?: string;
      data: Omit<ProjectItem, "_id">;
    }) => {
      const url = id
        ? `${apiUrl}/api/projects/${id}`
        : `${apiUrl}/api/projects`;
      const method = id ? "PUT" : "POST";
      const res = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save project.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsProjectDialogOpen(false);
      resetProjectForm();
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchWithAuth(`${apiUrl}/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const resetProjectForm = () => {
    setEditingProject(null);
    setProjectTitle("");
    setProjectDesc("");
    setProjectImage("");
    setProjectTech("");
    setProjectLive("");
    setProjectGithub("");
    setProjectFeatured(false);
    setProjectOrder("0");
    setProjectFormError(null);
  };

  const openEditProject = (p: ProjectItem) => {
    setEditingProject(p);
    setProjectTitle(p.title);
    setProjectDesc(p.description);
    setProjectImage(p.image);
    setProjectTech(p.tech.join(", "));
    setProjectLive(p.live);
    setProjectGithub(p.github);
    setProjectFeatured(p.featured);
    setProjectOrder(String(p.order));
    setProjectFormError(null);
    setIsProjectDialogOpen(true);
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !projectTitle ||
      !projectDesc ||
      !projectImage ||
      !projectTech ||
      !projectLive ||
      !projectGithub
    ) {
      setProjectFormError("All fields except order and featured are required.");
      return;
    }

    const techArray = projectTech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (techArray.length === 0) {
      setProjectFormError("Please add at least one tech stack tag.");
      return;
    }

    const data = {
      title: projectTitle,
      description: projectDesc,
      image: projectImage,
      tech: techArray,
      live: projectLive,
      github: projectGithub,
      featured: projectFeatured,
      order: Number(projectOrder) || 0,
    };

    projectMutation.mutate({ id: editingProject?._id, data });
  };

  const { data: projects = [], isLoading } = projectsQuery;

  const currentFeaturedCount = projects.filter((p) => p.featured).length;
  const willBeFeaturedCount =
    currentFeaturedCount +
    (projectFeatured && !(editingProject && editingProject.featured) ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-soft shrink-0">
            <Code className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Projects Catalog
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage and feature the project items showcased in your portfolio
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => {
            resetProjectForm();
            setIsProjectDialogOpen(true);
          }}
          className="cursor-pointer bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card/20">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center text-center p-12 border-muted bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
          <div className="h-12 w-12 rounded-full bg-muted grid place-items-center mb-4 text-muted-foreground">
            <Code className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg font-bold">
            No projects listed
          </CardTitle>
          <CardDescription className="max-w-xs mt-1 mb-5">
            Start showcasing your work! Click the button below to add your first
            project entry.
          </CardDescription>
          <Button
            onClick={() => {
              resetProjectForm();
              setIsProjectDialogOpen(true);
            }}
            className="cursor-pointer"
          >
            Add first project
          </Button>
        </Card>
      ) : (
        <Card className="border-border bg-card/40 backdrop-blur-lg shadow-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[80px]">Order</TableHead>
                  <TableHead className="w-[220px]">Project Info</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[200px]">Tech Tags</TableHead>
                  <TableHead className="w-[120px]">Featured</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => (
                  <TableRow
                    key={p._id}
                    className="border-border/60 hover:bg-muted/10 transition-colors group"
                  >
                    <TableCell className="align-middle font-mono text-sm font-semibold text-muted-foreground">
                      {p.order}
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-14 h-9 rounded-lg object-cover border border-border shrink-0 shadow-soft"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-foreground leading-tight">
                            {p.title}
                          </span>
                          <div className="flex items-center gap-2.5 mt-2">
                            <a
                              href={p.live}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-0.5"
                            >
                              Live <ExternalLink className="h-3 w-3" />
                            </a>
                            <span className="text-muted-foreground/45 text-xs">
                              •
                            </span>
                            <a
                              href={p.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-0.5"
                            >
                              Code <Github className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-4 max-w-xs">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.tech.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="text-[10px] px-2 py-0 border-border bg-secondary/30 text-secondary-foreground"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      {p.featured ? (
                        <Badge className="bg-gradient-primary text-primary-foreground border-transparent text-[10px] shadow-soft">
                          Featured
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Standard
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditProject(p)}
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
                                Delete Project?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete project "
                                {p.title}"? This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteProjectMutation.mutate(p._id)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                              >
                                Delete Project
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

      {/* Project Form Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl border-border bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Fill out the fields to showcase your project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProjectSubmit} className="space-y-4 mt-2">
            {projectFormError && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{projectFormError}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Title
                </label>
                <Input
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="E.g. Task Manager"
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Display Order
                </label>
                <Input
                  type="number"
                  value={projectOrder}
                  onChange={(e) => setProjectOrder(e.target.value)}
                  placeholder="0"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Image URL
              </label>
              <Input
                value={projectImage}
                onChange={(e) => setProjectImage(e.target.value)}
                placeholder="https://i.ibb.co.com/..."
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Description
              </label>
              <Textarea
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                placeholder="Describe the application features..."
                rows={3}
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Tech Stack (comma-separated list)
              </label>
              <Input
                value={projectTech}
                onChange={(e) => setProjectTech(e.target.value)}
                placeholder="React, Node.js, Express, MongoDB"
                required
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Live URL
                </label>
                <Input
                  value={projectLive}
                  onChange={(e) => setProjectLive(e.target.value)}
                  placeholder="https://..."
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  GitHub URL
                </label>
                <Input
                  value={projectGithub}
                  onChange={(e) => setProjectGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  required
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="proj_featured"
                  checked={projectFeatured}
                  onChange={(e) => setProjectFeatured(e.target.checked)}
                  className="h-4 w-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <div className="flex flex-col">
                  <label
                    htmlFor="proj_featured"
                    className="text-xs font-semibold text-foreground cursor-pointer select-none"
                  >
                    Featured project
                  </label>
                  <span className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                    Mark up to 4 projects as Featured — these are the ones shown
                    first on your homepage before 'Load More' is clicked.
                  </span>
                </div>
              </div>

              {willBeFeaturedCount > 4 && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-[10px] text-amber-500 leading-normal">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>
                    Warning: You will have {willBeFeaturedCount} featured
                    projects. Only the first 4 (by order) will show first on the
                    homepage.
                  </span>
                </div>
              )}
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProjectDialogOpen(false)}
                className="cursor-pointer rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300"
              >
                {projectMutation.isPending ? "Saving..." : "Save Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
