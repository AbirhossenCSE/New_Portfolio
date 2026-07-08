import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  Edit,
  Plus,
  LogOut,
  Clock,
  User,
  Mail,
  MessageSquare,
  Lock,
  RefreshCw,
  AlertCircle,
  Briefcase,
  Building2,
  Code,
  Layout,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

// Helper for managing the JWT token cookie
const setTokenCookie = (val: string) => {
  document.cookie = `admin_token=${val}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;
};

const clearTokenCookie = () => {
  document.cookie = "admin_token=; path=/; max-age=0";
};

// Interfaces
interface MessageItem {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: "Unread" | "Read" | "Important";
}

interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  live: string;
  github: string;
  featured: boolean;
  order: number;
}

interface SkillItem {
  _id: string;
  name: string;
  description: string;
  level: number;
  category: string;
  order: number;
}

interface ExperienceItem {
  _id: string;
  role: string;
  company: string;
  duration: string;
  current: boolean;
  description: string;
  order: number;
}

const CATEGORIES = ["Frontend", "Backend", "Database & ORM", "Tools", "Deployment"];

function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeSection, setActiveSection] = useState<"Messages" | "Projects" | "Skills" | "Experience">("Messages");
  const [messageFilter, setMessageFilter] = useState<"All" | "Unread" | "Important">("All");

  // Project dialog / form state
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectImage, setProjectImage] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [projectLive, setProjectLive] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectFeatured, setProjectFeatured] = useState(false);
  const [projectOrder, setProjectOrder] = useState("0");
  const [projectFormError, setProjectFormError] = useState<string | null>(null);

  // Skill dialog / form state
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [skillName, setSkillName] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillLevel, setSkillLevel] = useState("80");
  const [skillCategory, setSkillCategory] = useState("Frontend");
  const [skillOrder, setSkillOrder] = useState("0");
  const [skillFormError, setSkillFormError] = useState<string | null>(null);

  // Experience dialog / form state
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDuration, setExpDuration] = useState("");
  const [expCurrent, setExpCurrent] = useState(false);
  const [expDesc, setExpDesc] = useState("");
  const [expOrder, setExpOrder] = useState("0");
  const [expFormError, setExpFormError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Check token cookie on mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const match = document.cookie.match(/(?:^|; )admin_token=([^;]*)/);
    if (match) {
      setToken(match[1]);
    }
  }, []);

  // Fetch messages query
  const messagesQuery = useQuery<MessageItem[]>({
    queryKey: ["messages", token],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load messages.");
      return res.json();
    },
    enabled: !!token && activeSection === "Messages",
  });

  // Fetch projects query
  const projectsQuery = useQuery<ProjectItem[]>({
    queryKey: ["projects", token],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/projects`);
      if (!res.ok) throw new Error("Failed to load projects.");
      return res.json();
    },
    enabled: !!token && activeSection === "Projects",
  });

  // Fetch skills query
  const skillsQuery = useQuery<SkillItem[]>({
    queryKey: ["skills", token],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/skills`);
      if (!res.ok) throw new Error("Failed to load skills.");
      return res.json();
    },
    enabled: !!token && activeSection === "Skills",
  });

  // Fetch experience query
  const experienceQuery = useQuery<ExperienceItem[]>({
    queryKey: ["experiences", token],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/experience`);
      if (!res.ok) throw new Error("Failed to load experience.");
      return res.json();
    },
    enabled: !!token && activeSection === "Experience",
  });

  // ----------------------------------------
  // Mutations
  // ----------------------------------------

  // Message status mutation
  const messageStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      const res = await fetch(`${apiUrl}/api/contact/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update message status.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiUrl}/api/contact/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete message.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  // Project mutate
  const projectMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: any }) => {
      const url = id ? `${apiUrl}/api/projects/${id}` : `${apiUrl}/api/projects`;
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  // Delete project
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete project.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Skill mutate
  const skillMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: any }) => {
      const url = id ? `${apiUrl}/api/skills/${id}` : `${apiUrl}/api/skills`;
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  // Delete skill
  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiUrl}/api/skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete skill.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  // Experience mutate
  const experienceMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: any }) => {
      const url = id ? `${apiUrl}/api/experience/${id}` : `${apiUrl}/api/experience`;
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  // Delete experience
  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiUrl}/api/experience/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete experience.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    },
  });

  // ----------------------------------------
  // Form reset handlers
  // ----------------------------------------
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

  const resetSkillForm = () => {
    setEditingSkill(null);
    setSkillName("");
    setSkillDesc("");
    setSkillLevel("80");
    setSkillCategory("Frontend");
    setSkillOrder("0");
    setSkillFormError(null);
  };

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

  // ----------------------------------------
  // Form edit triggers
  // ----------------------------------------
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

  const openEditSkill = (s: SkillItem) => {
    setEditingSkill(s);
    setSkillName(s.name);
    setSkillDesc(s.description);
    setSkillLevel(String(s.level));
    setSkillCategory(s.category);
    setSkillOrder(String(s.order));
    setSkillFormError(null);
    setIsSkillDialogOpen(true);
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

  // ----------------------------------------
  // Form submit handlers
  // ----------------------------------------
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !projectDesc || !projectImage || !projectTech || !projectLive || !projectGithub) {
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

  const handleSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName || !skillDesc || !skillCategory) {
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
      category: skillCategory,
      order: Number(skillOrder) || 0,
    };

    skillMutation.mutate({ id: editingSkill?._id, data });
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) return;

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setLoginError("Invalid username or password");
        } else {
          setLoginError("Server communication failed.");
        }
        setIsLoggingIn(false);
        return;
      }

      const data = await res.json();
      if (data.token) {
        setTokenCookie(data.token);
        setToken(data.token);
        setUsernameInput("");
        setPasswordInput("");
      }
    } catch (err) {
      setLoginError("Network connection failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearTokenCookie();
    setToken(null);
  };

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Login view
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <Card className="relative w-full max-w-md border-muted bg-card/60 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your administration credentials to access dashboard.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLoginSubmit}>
            <CardContent className="space-y-4">
              {loginError && (
                <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Username</label>
                <div className="relative">
                  <User className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Username"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Password</label>
                <div className="relative">
                  <Lock className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full cursor-pointer" disabled={isLoggingIn}>
                {isLoggingIn ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: MessageItem["status"]) => {
    switch (status) {
      case "Unread":
        return <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Unread</Badge>;
      case "Read":
        return <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80">Read</Badge>;
      case "Important":
        return <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20">Important</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  // Messages Query destructures
  const { data: messages = [], isLoading: isMessagesLoading, refetch: refetchMessages } = messagesQuery;
  const filteredMessages = messages.filter((m) => messageFilter === "All" ? true : m.status === messageFilter);

  // Projects Query destructures
  const { data: projects = [], isLoading: isProjectsLoading, refetch: refetchProjects } = projectsQuery;

  // Skills Query destructures
  const { data: skills = [], isLoading: isSkillsLoading, refetch: refetchSkills } = skillsQuery;

  // Experience Query destructures
  const { data: experiences = [], isLoading: isExperiencesLoading, refetch: refetchExperiences } = experienceQuery;

  const currentLoading =
    (activeSection === "Messages" && isMessagesLoading) ||
    (activeSection === "Projects" && isProjectsLoading) ||
    (activeSection === "Skills" && isSkillsLoading) ||
    (activeSection === "Experience" && isExperiencesLoading);

  const handleRefetch = () => {
    if (activeSection === "Messages") refetchMessages();
    if (activeSection === "Projects") refetchProjects();
    if (activeSection === "Skills") refetchSkills();
    if (activeSection === "Experience") refetchExperiences();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.08),rgba(255,255,255,0))]" />

      {/* Header bar */}
      <header className="relative border-b border-muted bg-card/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-xs text-muted-foreground">Portfolio CMS Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleRefetch} className="cursor-pointer" disabled={currentLoading}>
              <RefreshCw className={`h-4 w-4 ${currentLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="cursor-pointer flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeSection} onValueChange={(val) => setActiveSection(val as any)} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-muted pb-4 gap-4">
            <TabsList className="grid w-full grid-cols-4 md:w-[480px]">
              <TabsTrigger value="Messages" className="cursor-pointer">Messages</TabsTrigger>
              <TabsTrigger value="Projects" className="cursor-pointer">Projects</TabsTrigger>
              <TabsTrigger value="Skills" className="cursor-pointer">Skills</TabsTrigger>
              <TabsTrigger value="Experience" className="cursor-pointer">Experience</TabsTrigger>
            </TabsList>

            {/* Sub headers based on section */}
            {activeSection === "Projects" && (
              <Button size="sm" onClick={() => { resetProjectForm(); setIsProjectDialogOpen(true); }} className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" /> Add Project
              </Button>
            )}
            {activeSection === "Skills" && (
              <Button size="sm" onClick={() => { resetSkillForm(); setIsSkillDialogOpen(true); }} className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" /> Add Skill
              </Button>
            )}
            {activeSection === "Experience" && (
              <Button size="sm" onClick={() => { resetExperienceForm(); setIsExperienceDialogOpen(true); }} className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" /> Add Experience
              </Button>
            )}
          </div>

          {/* MESSAGES TAB CONTENT */}
          <TabsContent value="Messages">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" /> Messages Box
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage public inquiries</p>
                </div>
                <Tabs value={messageFilter} onValueChange={(val) => setMessageFilter(val as any)}>
                  <TabsList className="grid w-full grid-cols-3 sm:w-[300px]">
                    <TabsTrigger value="All" className="cursor-pointer">All</TabsTrigger>
                    <TabsTrigger value="Unread" className="cursor-pointer">Unread</TabsTrigger>
                    <TabsTrigger value="Important" className="cursor-pointer">Important</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {currentLoading ? (
                <div className="flex h-64 items-center justify-center rounded-xl border border-muted bg-card/40">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-muted bg-card/30 text-center p-6">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-semibold">No messages found</h3>
                </div>
              ) : (
                <div className="rounded-xl border border-muted bg-card/60 backdrop-blur-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Date</TableHead>
                        <TableHead className="w-[180px]">Sender</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMessages.map((msg) => (
                        <TableRow key={msg._id} className="hover:bg-muted/30">
                          <TableCell className="font-medium align-top py-4">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              <span className="text-xs">{formatDate(msg.createdAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="align-top py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground text-sm flex items-center gap-1">
                                <User className="h-3 w-3 shrink-0 text-muted-foreground" />
                                {msg.name}
                              </span>
                              <a href={`mailto:${msg.email}`} className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                                <Mail className="h-3 w-3 shrink-0 text-primary/75" />
                                {msg.email}
                              </a>
                            </div>
                          </TableCell>
                          <TableCell className="align-top py-4 max-w-md">
                            <div className="text-sm text-foreground break-words whitespace-pre-wrap">
                              <ExpandableText text={msg.message} />
                            </div>
                          </TableCell>
                          <TableCell className="align-top py-4">
                            <div className="flex flex-col gap-2">
                              {getStatusBadge(msg.status)}
                              <Select
                                value={msg.status}
                                onValueChange={(newStatus) => messageStatusMutation.mutate({ id: msg._id, newStatus })}
                              >
                                <SelectTrigger className="w-[125px] h-8 cursor-pointer text-xs">
                                  <SelectValue placeholder="Update Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Unread">Unread</SelectItem>
                                  <SelectItem value="Read">Read</SelectItem>
                                  <SelectItem value="Important">Important</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                          <TableCell className="align-top py-4 text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete message?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this message from {msg.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteMessageMutation.mutate(msg._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* PROJECTS TAB CONTENT */}
          <TabsContent value="Projects">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Code className="h-6 w-6 text-primary" /> Projects Catalog
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Manage showcased works</p>
              </div>

              {currentLoading ? (
                <div className="flex h-64 items-center justify-center rounded-xl border border-muted bg-card/40">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : projects.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-muted bg-card/30 text-center p-6">
                  <Code className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-semibold">No projects found</h3>
                </div>
              ) : (
                <div className="rounded-xl border border-muted bg-card/60 backdrop-blur-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Order</TableHead>
                        <TableHead className="w-[200px]">Project</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[180px]">Tech Stack</TableHead>
                        <TableHead className="w-[100px]">Featured</TableHead>
                        <TableHead className="w-[120px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((p) => (
                        <TableRow key={p._id} className="hover:bg-muted/30">
                          <TableCell className="align-middle font-mono text-sm">{p.order}</TableCell>
                          <TableCell className="align-top py-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.title} className="w-12 h-8 rounded object-cover border border-border" />
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm">{p.title}</span>
                                <div className="flex gap-2 mt-1">
                                  <a href={p.live} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Live</a>
                                  <span className="text-muted-foreground text-xs">•</span>
                                  <a href={p.github} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Github</a>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="align-top py-4 max-w-sm">
                            <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                          </TableCell>
                          <TableCell className="align-top py-4">
                            <div className="flex flex-wrap gap-1">
                              {p.tech.map((t) => (
                                <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="align-middle">
                            {p.featured ? <Badge className="bg-gradient-primary">Featured</Badge> : <span className="text-xs text-muted-foreground">No</span>}
                          </TableCell>
                          <TableCell className="align-middle text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openEditProject(p)} className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete project "{p.title}"? This cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteProjectMutation.mutate(p._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
                                      Delete
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
              )}
            </div>
          </TabsContent>

          {/* SKILLS TAB CONTENT */}
          <TabsContent value="Skills">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Layout className="h-6 w-6 text-primary" /> Skills Database
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Manage technical toolset</p>
              </div>

              {currentLoading ? (
                <div className="flex h-64 items-center justify-center rounded-xl border border-muted bg-card/40">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : skills.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-muted bg-card/30 text-center p-6">
                  <Layout className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-semibold">No skills found</h3>
                </div>
              ) : (
                <div className="rounded-xl border border-muted bg-card/60 backdrop-blur-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Order</TableHead>
                        <TableHead className="w-[180px]">Category</TableHead>
                        <TableHead className="w-[150px]">Skill Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[120px]">Proficiency</TableHead>
                        <TableHead className="w-[120px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {skills.map((s) => (
                        <TableRow key={s._id} className="hover:bg-muted/30">
                          <TableCell className="align-middle font-mono text-sm">{s.order}</TableCell>
                          <TableCell className="align-middle">
                            <Badge variant="outline">{s.category}</Badge>
                          </TableCell>
                          <TableCell className="align-middle font-bold text-sm">{s.name}</TableCell>
                          <TableCell className="align-top py-4 max-w-sm">
                            <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                          </TableCell>
                          <TableCell className="align-middle font-medium text-xs text-primary">{s.level}%</TableCell>
                          <TableCell className="align-middle text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openEditSkill(s)} className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Skill?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete skill "{s.name}"? This cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteSkillMutation.mutate(s._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
                                      Delete
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
              )}
            </div>
          </TabsContent>

          {/* EXPERIENCE TAB CONTENT */}
          <TabsContent value="Experience">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" /> Work History
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Manage employment entries</p>
              </div>

              {currentLoading ? (
                <div className="flex h-64 items-center justify-center rounded-xl border border-muted bg-card/40">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : experiences.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-muted bg-card/30 text-center p-6">
                  <Briefcase className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-semibold">No experience entries found</h3>
                </div>
              ) : (
                <div className="rounded-xl border border-muted bg-card/60 backdrop-blur-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Order</TableHead>
                        <TableHead className="w-[200px]">Company</TableHead>
                        <TableHead className="w-[180px]">Role</TableHead>
                        <TableHead className="w-[150px]">Duration</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[120px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {experiences.map((exp) => (
                        <TableRow key={exp._id} className="hover:bg-muted/30">
                          <TableCell className="align-middle font-mono text-sm">{exp.order}</TableCell>
                          <TableCell className="align-middle">
                            <span className="font-semibold text-foreground text-sm flex items-center gap-1">
                              <Building2 className="h-4 w-4 shrink-0 text-primary" />
                              {exp.company}
                            </span>
                          </TableCell>
                          <TableCell className="align-middle font-medium text-sm">{exp.role}</TableCell>
                          <TableCell className="align-middle text-xs">
                            <span className="inline-flex items-center gap-1 shrink-0">
                              {exp.duration}
                              {exp.current && <Badge className="ml-1 text-[9px] px-1 bg-accent/15 text-accent-foreground">Current</Badge>}
                            </span>
                          </TableCell>
                          <TableCell className="align-top py-4 max-w-sm">
                            <p className="text-xs text-muted-foreground line-clamp-2">{exp.description}</p>
                          </TableCell>
                          <TableCell className="align-middle text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openEditExperience(exp)} className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Experience Entry?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete experience at "{exp.company}"? This cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteExperienceMutation.mutate(exp._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
                                      Delete
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
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* ----------------------------------------
          MODALS / DIALOGS
          ---------------------------------------- */}

      {/* Project Form Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            <DialogDescription>Fill out the fields to showcase your project.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProjectSubmit} className="space-y-4">
            {projectFormError && (
              <div className="flex items-center gap-2 rounded border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{projectFormError}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Title</label>
                <Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="E.g. Task Manager" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Display Order / Index</label>
                <Input type="number" value={projectOrder} onChange={(e) => setProjectOrder(e.target.value)} placeholder="0" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Image URL</label>
              <Input value={projectImage} onChange={(e) => setProjectImage(e.target.value)} placeholder="https://i.ibb.co.com/..." required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Description</label>
              <Textarea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} placeholder="Describe the application features..." rows={3} required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Tech Stack (comma-separated list)</label>
              <Input value={projectTech} onChange={(e) => setProjectTech(e.target.value)} placeholder="React, Node.js, Express, MongoDB" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Live URL</label>
                <Input value={projectLive} onChange={(e) => setProjectLive(e.target.value)} placeholder="https://..." required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">GitHub URL</label>
                <Input value={projectGithub} onChange={(e) => setProjectGithub(e.target.value)} placeholder="https://github.com/..." required />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="proj_featured"
                checked={projectFeatured}
                onChange={(e) => setProjectFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="proj_featured" className="text-xs font-medium text-foreground cursor-pointer select-none">
                Featured project (promotes to top of lists)
              </label>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsProjectDialogOpen(false)} className="cursor-pointer">Cancel</Button>
              <Button type="submit" className="cursor-pointer">
                {projectMutation.isPending ? "Saving..." : "Save Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Skill Form Dialog */}
      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
            <DialogDescription>Fill out the fields to add a skill to your toolkit.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSkillSubmit} className="space-y-4">
            {skillFormError && (
              <div className="flex items-center gap-2 rounded border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{skillFormError}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Skill Name</label>
                <Input value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="E.g. TypeScript" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Proficiency (0-100%)</label>
                <Input type="number" min="0" max="100" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Category</label>
                <Select value={skillCategory} onValueChange={setSkillCategory}>
                  <SelectTrigger className="w-full h-9 cursor-pointer">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Sort Order</label>
                <Input type="number" value={skillOrder} onChange={(e) => setSkillOrder(e.target.value)} placeholder="0" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Brief Description</label>
              <Textarea value={skillDesc} onChange={(e) => setSkillDesc(e.target.value)} placeholder="E.g. Code safety and type definitions..." rows={2} required />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsSkillDialogOpen(false)} className="cursor-pointer">Cancel</Button>
              <Button type="submit" className="cursor-pointer">
                {skillMutation.isPending ? "Saving..." : "Save Skill"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Experience Form Dialog */}
      <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingExperience ? "Edit Experience" : "Add New Experience"}</DialogTitle>
            <DialogDescription>Fill out the fields to document a professional role.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExperienceSubmit} className="space-y-4">
            {expFormError && (
              <div className="flex items-center gap-2 rounded border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{expFormError}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Company</label>
                <Input value={expCompany} onChange={(e) => setExpCompany(e.target.value)} placeholder="E.g. Mindsynth Technology" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Role / Title</label>
                <Input value={expRole} onChange={(e) => setExpRole(e.target.value)} placeholder="E.g. Frontend Developer" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Duration string</label>
                <Input value={expDuration} onChange={(e) => setExpDuration(e.target.value)} placeholder="E.g. May 2025 – Present" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Sort Order (0 = newest)</label>
                <Input type="number" value={expOrder} onChange={(e) => setExpOrder(e.target.value)} placeholder="0" />
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
              <label htmlFor="exp_current" className="text-xs font-medium text-foreground cursor-pointer select-none">
                This is my current employment role
              </label>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Job Description / Responsibilities</label>
              <Textarea value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="Highlight your work and contributions..." rows={4} required />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsExperienceDialogOpen(false)} className="cursor-pointer">Cancel</Button>
              <Button type="submit" className="cursor-pointer">
                {experienceMutation.isPending ? "Saving..." : "Save Experience"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Expandable message text helper component
function ExpandableText({ text, maxLength = 120 }: { text: string; maxLength?: number }) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  return (
    <div>
      <span>{expanded ? text : `${text.slice(0, maxLength)}...`}</span>
      <button
        onClick={() => setExpanded(!expanded)}
        className="ml-1 text-xs font-semibold text-primary hover:underline focus:outline-none cursor-pointer inline-block"
      >
        {expanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
}
