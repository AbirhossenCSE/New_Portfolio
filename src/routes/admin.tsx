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
  Layers,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  ExternalLink,
  Github,
  GraduationCap,
  Save,
  CheckCircle,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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

interface EducationItem {
  _id: string;
  year: string;
  degree: string;
  institution: string;
  description: string;
  order: number;
}

interface ProfileItem {
  _id?: string;
  name: string;
  fullName: string;
  roles: string[];
  intro: string;
  availability: string;
  resumeUrl: string;
  homeImage: string;
  aboutImage: string;
  email: string;
  phone: string;
  phoneIntl: string;
  whatsapp: string;
  location: string;
  socials: {
    github: string;
    linkedin: string;
    facebook: string;
  };
  aboutParagraphs: string[];
  aboutTags: string[];
  quickInfo: {
    label: string;
    value: string;
  }[];
}

const DEFAULT_CATEGORIES = ["Frontend", "Backend", "Database & ORM", "Tools", "Deployment"];

function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeSection, setActiveSection] = useState<"Messages" | "Profile" | "Projects" | "Skills" | "Experience" | "Education">("Messages");
  const [messageFilter, setMessageFilter] = useState<"All" | "Unread" | "Important">("All");

  // Profile Form state
  const [profName, setProfName] = useState("");
  const [profFullName, setProfFullName] = useState("");
  const [profRoles, setProfRoles] = useState("");
  const [profIntro, setProfIntro] = useState("");
  const [profAvailability, setProfAvailability] = useState("");
  const [profResumeUrl, setProfResumeUrl] = useState("");
  const [profHomeImage, setProfHomeImage] = useState("");
  const [profAboutImage, setProfAboutImage] = useState("");
  const [profEmail, setProfEmail] = useState("");
  const [profPhone, setProfPhone] = useState("");
  const [profPhoneIntl, setProfPhoneIntl] = useState("");
  const [profWhatsapp, setProfWhatsapp] = useState("");
  const [profLocation, setProfLocation] = useState("");
  const [profGithub, setProfGithub] = useState("");
  const [profLinkedin, setProfLinkedin] = useState("");
  const [profFacebook, setProfFacebook] = useState("");
  const [profAboutParagraphs, setProfAboutParagraphs] = useState<string[]>([]);
  const [profAboutTags, setProfAboutTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [profQuickInfo, setProfQuickInfo] = useState<{ label: string; value: string }[]>([
    { label: "Location", value: "" },
    { label: "Education", value: "" },
    { label: "Experience", value: "" },
    { label: "Focus", value: "" },
  ]);
  const [profileFormSuccess, setProfileFormSuccess] = useState(false);
  const [profileFormError, setProfileFormError] = useState<string | null>(null);

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
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
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

  // Education dialog / form state
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);
  const [eduYear, setEduYear] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduDesc, setEduDesc] = useState("");
  const [eduOrder, setEduOrder] = useState("0");
  const [eduFormError, setEduFormError] = useState<string | null>(null);

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
    enabled: !!token,
  });

  // Fetch profile query
  const profileQuery = useQuery<ProfileItem>({
    queryKey: ["profile", token],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/profile`);
      if (!res.ok) throw new Error("Failed to load profile.");
      return res.json();
    },
    enabled: !!token,
  });

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

  // Sync profile data state once loaded from server
  useEffect(() => {
    if (profileQuery.data) {
      const p = profileQuery.data;
      setProfName(p.name || "");
      setProfFullName(p.fullName || "");
      setProfRoles(p.roles ? p.roles.join(", ") : "");
      setProfIntro(p.intro || "");
      setProfAvailability(p.availability || "");
      setProfResumeUrl(p.resumeUrl || "");
      setProfHomeImage(p.homeImage || "");
      setProfAboutImage(p.aboutImage || "");
      setProfEmail(p.email || "");
      setProfPhone(p.phone || "");
      setProfPhoneIntl(p.phoneIntl || "");
      setProfWhatsapp(p.whatsapp || "");
      setProfLocation(p.location || "");
      setProfGithub(p.socials?.github || "");
      setProfLinkedin(p.socials?.linkedin || "");
      setProfFacebook(p.socials?.facebook || "");
      setProfAboutParagraphs(p.aboutParagraphs || []);
      setProfAboutTags(p.aboutTags || []);

      // Re-hydrate quickInfo array labels safely
      const defaultLabels = ["Location", "Education", "Experience", "Focus"];
      const loadedQuickInfo = defaultLabels.map((lbl) => {
        const found = p.quickInfo?.find((qi) => qi.label === lbl);
        return { label: lbl, value: found ? found.value : "" };
      });
      setProfQuickInfo(loadedQuickInfo);
    }
  }, [profileQuery.data]);

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

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`${apiUrl}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save profile changes.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setProfileFormSuccess(true);
      setTimeout(() => setProfileFormSuccess(false), 4000);
    },
    onError: (err: any) => {
      setProfileFormError(err.message || "An error occurred.");
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
      const resA = await fetch(`${apiUrl}/api/skills/${skillAId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: orderA }),
      });
      if (!resA.ok) throw new Error("Failed to update order of first skill.");

      const resB = await fetch(`${apiUrl}/api/skills/${skillBId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: orderB }),
      });
      if (!resB.ok) throw new Error("Failed to update order of second skill.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
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

  // Education mutate
  const educationMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: any }) => {
      const url = id ? `${apiUrl}/api/education/${id}` : `${apiUrl}/api/education`;
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  // Delete education
  const deleteEducationMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiUrl}/api/education/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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
      const resA = await fetch(`${apiUrl}/api/education/${eduAId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: orderA }),
      });
      if (!resA.ok) throw new Error("Failed to update order of first education entry.");

      const resB = await fetch(`${apiUrl}/api/education/${eduBId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: orderB }),
      });
      if (!resB.ok) throw new Error("Failed to update order of second education entry.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
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
    setSkillCategory(DEFAULT_CATEGORIES[0]);
    setUseCustomCategory(false);
    setCustomCategoryName("");
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

  const resetEducationForm = () => {
    setEditingEducation(null);
    setEduYear("");
    setEduDegree("");
    setEduInstitution("");
    setEduDesc("");
    setEduOrder("0");
    setEduFormError(null);
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

  // ----------------------------------------
  // Form submit handlers
  // ----------------------------------------
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileFormError(null);

    const rolesArray = profRoles
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    if (rolesArray.length === 0) {
      setProfileFormError("Please add at least one role.");
      return;
    }

    const data = {
      name: profName,
      fullName: profFullName,
      roles: rolesArray,
      intro: profIntro,
      availability: profAvailability,
      resumeUrl: profResumeUrl,
      homeImage: profHomeImage,
      aboutImage: profAboutImage,
      email: profEmail,
      phone: profPhone,
      phoneIntl: profPhoneIntl,
      whatsapp: profWhatsapp,
      location: profLocation,
      socials: {
        github: profGithub,
        linkedin: profLinkedin,
        facebook: profFacebook,
      },
      aboutParagraphs: profAboutParagraphs.filter((p) => p.trim() !== ""),
      aboutTags: profAboutTags,
      quickInfo: profQuickInfo,
    };

    profileMutation.mutate(data);
  };

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
    const finalCategory = useCustomCategory ? customCategoryName.trim() : skillCategory;

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

  // Reordering handlers
  const handleMoveSkill = (categoryName: string, skillId: string, direction: "up" | "down") => {
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

  const handleMoveEducation = (educationId: string, direction: "up" | "down") => {
    const sortedEdus = (educationQuery.data || [])
      .sort((a, b) => a.order - b.order || a.year.localeCompare(b.year));

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

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = newTagInput.trim();
      if (val && !profAboutTags.includes(val)) {
        setProfAboutTags([...profAboutTags, val]);
        setNewTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProfAboutTags(profAboutTags.filter((t) => t !== tagToRemove));
  };

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...profAboutParagraphs];
    updated[index] = val;
    setProfAboutParagraphs(updated);
  };

  const handleRemoveParagraph = (index: number) => {
    setProfAboutParagraphs(profAboutParagraphs.filter((_, i) => i !== index));
  };

  const handleAddParagraph = () => {
    setProfAboutParagraphs([...profAboutParagraphs, ""]);
  };

  const handleQuickInfoChange = (index: number, val: string) => {
    const updated = [...profQuickInfo];
    updated[index].value = val;
    setProfQuickInfo(updated);
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
        <Card className="relative w-full max-w-md border-muted bg-card/60 backdrop-blur-md shadow-card">
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
              <Button type="submit" className="w-full cursor-pointer bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-lift transition-all duration-300" disabled={isLoggingIn}>
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
        return <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-[10px]">Unread</Badge>;
      case "Read":
        return <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80 text-[10px]">Read</Badge>;
      case "Important":
        return <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-[10px]">Important</Badge>;
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

  // Queries destructures
  const { data: messages = [], isLoading: isMessagesLoading, refetch: refetchMessages } = messagesQuery;
  const { data: projects = [], isLoading: isProjectsLoading, refetch: refetchProjects } = projectsQuery;
  const { data: skills = [], isLoading: isSkillsLoading, refetch: refetchSkills } = skillsQuery;
  const { data: experiences = [], isLoading: isExperiencesLoading, refetch: refetchExperiences } = experienceQuery;
  const { data: education = [], isLoading: isEducationLoading, refetch: refetchEducation } = educationQuery;

  const filteredMessages = messages.filter((m) =>
    messageFilter === "All" ? true : m.status === messageFilter
  );

  const currentLoading =
    (activeSection === "Messages" && isMessagesLoading) ||
    (activeSection === "Profile" && profileQuery.isLoading) ||
    (activeSection === "Projects" && isProjectsLoading) ||
    (activeSection === "Skills" && isSkillsLoading) ||
    (activeSection === "Experience" && isExperiencesLoading) ||
    (activeSection === "Education" && isEducationLoading);

  const handleRefetch = () => {
    if (activeSection === "Messages") refetchMessages();
    if (activeSection === "Profile") profileQuery.refetch();
    if (activeSection === "Projects") refetchProjects();
    if (activeSection === "Skills") refetchSkills();
    if (activeSection === "Experience") refetchExperiences();
    if (activeSection === "Education") refetchEducation();
  };

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

  const sidebarLinks = [
    { id: "Messages", label: "Messages", icon: MessageSquare, description: "Contact submissions" },
    { id: "Profile", label: "Profile", icon: User, description: "Personal details & bio" },
    { id: "Projects", label: "Projects", icon: Code, description: "Portfolio showcase" },
    { id: "Skills", label: "Skills", icon: Layers, description: "Technical toolbox" },
    { id: "Experience", label: "Experience", icon: Briefcase, description: "Work history" },
    { id: "Education", label: "Education", icon: GraduationCap, description: "Academic timeline" },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.06),rgba(255,255,255,0))]" />

      {/* ----------------------------------------
          DESKTOP SIDEBAR
          ---------------------------------------- */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/40 backdrop-blur-lg p-6 fixed h-screen z-30 justify-between">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" /> Admin Panel
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Portfolio Manager</p>
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveSection(link.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer group text-left",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-300", isActive ? "" : "group-hover:scale-110")} />
                  <div className="flex flex-col">
                    <span>{link.label}</span>
                    <span className={cn("text-[9px] font-normal leading-none mt-0.5", isActive ? "text-primary-foreground/75" : "text-muted-foreground/75")}>
                      {link.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-bold">A</div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Administrator</span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5">Secure Session</span>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl text-xs py-2 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300">
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* ----------------------------------------
          MOBILE HEADER & SCROLLABLE NAV
          ---------------------------------------- */}
      <div className="md:hidden flex flex-col border-b border-border bg-card/40 backdrop-blur-lg sticky top-0 z-30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">Admin Console</h1>
            <p className="text-[9px] text-muted-foreground leading-none">CMS Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefetch} className="cursor-pointer" disabled={currentLoading}>
              <RefreshCw className={`h-4 w-4 ${currentLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="cursor-pointer">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto mt-4 pb-1 scrollbar-none">
          {sidebarLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveSection(link.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer",
                  isActive
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground bg-muted/40 hover:text-foreground"
                )}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------
          MAIN CONTENT AREA
          ---------------------------------------- */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <main className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          
          {/* 1. MESSAGES SECTION */}
          {activeSection === "Messages" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-soft shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Messages Box</h2>
                    <p className="text-sm text-muted-foreground">Review and manage client contact form inquiries</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tabs value={messageFilter} onValueChange={(val) => setMessageFilter(val as any)} className="w-auto">
                    <TabsList className="grid grid-cols-3 w-[260px] h-9">
                      <TabsTrigger value="All" className="cursor-pointer text-xs">All</TabsTrigger>
                      <TabsTrigger value="Unread" className="cursor-pointer text-xs">Unread</TabsTrigger>
                      <TabsTrigger value="Important" className="cursor-pointer text-xs">Important</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {currentLoading ? (
                <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card/20">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredMessages.length === 0 ? (
                <Card className="flex flex-col items-center justify-center text-center p-12 border-muted bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-muted grid place-items-center mb-4 text-muted-foreground">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">No messages found</CardTitle>
                  <CardDescription className="max-w-xs mt-1">
                    There are no contact form messages matching your current filter selection.
                  </CardDescription>
                </Card>
              ) : (
                <Card className="border-border bg-card/40 backdrop-blur-lg shadow-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="w-[180px]">Received Date</TableHead>
                          <TableHead className="w-[200px]">Sender Details</TableHead>
                          <TableHead>Message Content</TableHead>
                          <TableHead className="w-[150px]">Status Tag</TableHead>
                          <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMessages.map((msg) => (
                          <TableRow key={msg._id} className="border-border/60 hover:bg-muted/10 transition-colors group">
                            <TableCell className="align-top py-4">
                              <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                                <Clock className="h-3.5 w-3.5 shrink-0" />
                                <span>{formatDate(msg.createdAt)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="align-top py-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                                  <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                  {msg.name}
                                </span>
                                <a href={`mailto:${msg.email}`} className="text-xs text-primary hover:underline flex items-center gap-1.5 mt-1.5">
                                  <Mail className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                                  {msg.email}
                                </a>
                              </div>
                            </TableCell>
                            <TableCell className="align-top py-4 max-w-sm">
                              <div className="text-sm text-foreground break-words whitespace-pre-wrap leading-relaxed">
                                <ExpandableText text={msg.message} />
                              </div>
                            </TableCell>
                            <TableCell className="align-top py-4">
                              <div className="flex flex-col gap-2">
                                <div>{getStatusBadge(msg.status)}</div>
                                <Select
                                  value={msg.status}
                                  onValueChange={(newStatus) => messageStatusMutation.mutate({ id: msg._id, newStatus })}
                                >
                                  <SelectTrigger className="w-[125px] h-8 cursor-pointer text-xs rounded-lg border-border hover:bg-muted/40 transition-colors">
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
                            <TableCell className="align-middle text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors">
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
                </Card>
              )}
            </div>
          )}

          {/* 2. PROFILE SECTION */}
          {activeSection === "Profile" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-soft shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Site Profile Details</h2>
                    <p className="text-sm text-muted-foreground">Configure the global brand identity, bio metrics, and social urls</p>
                  </div>
                </div>
              </div>

              {profileQuery.isLoading ? (
                <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card/20">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {profileFormError && (
                    <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <span>{profileFormError}</span>
                    </div>
                  )}

                  {profileFormSuccess && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-500">
                      <CheckCircle className="h-5 w-5 shrink-0" />
                      <span>Profile changes saved successfully!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Settings */}
                    <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">General Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold">Short Name</label>
                            <Input value={profName} onChange={(e) => setProfName(e.target.value)} required className="rounded-xl" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold">Full Legal Name</label>
                            <Input value={profFullName} onChange={(e) => setProfFullName(e.target.value)} required className="rounded-xl" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Availability Status</label>
                          <Input value={profAvailability} onChange={(e) => setProfAvailability(e.target.value)} placeholder="E.g. Available for work" required className="rounded-xl" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Roles (comma-separated list)</label>
                          <Input value={profRoles} onChange={(e) => setProfRoles(e.target.value)} required className="rounded-xl" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Intro Description</label>
                          <Textarea value={profIntro} onChange={(e) => setProfIntro(e.target.value)} rows={3} required className="rounded-xl" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Contact & Location */}
                    <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contact & Location</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold">Email Address</label>
                            <Input type="email" value={profEmail} onChange={(e) => setProfEmail(e.target.value)} required className="rounded-xl" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold">Location</label>
                            <Input value={profLocation} onChange={(e) => setProfLocation(e.target.value)} required className="rounded-xl" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold">Phone Display</label>
                            <Input value={profPhone} onChange={(e) => setProfPhone(e.target.value)} required className="rounded-xl" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold">Phone (Intl Format)</label>
                            <Input value={profPhoneIntl} onChange={(e) => setProfPhoneIntl(e.target.value)} required className="rounded-xl" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">WhatsApp Link</label>
                          <Input value={profWhatsapp} onChange={(e) => setProfWhatsapp(e.target.value)} required className="rounded-xl" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Visuals & Assets */}
                    <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Visual Assets & Resume</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Hero Image URL</label>
                          <Input value={profHomeImage} onChange={(e) => setProfHomeImage(e.target.value)} required className="rounded-xl" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">About Image URL</label>
                          <Input value={profAboutImage} onChange={(e) => setProfAboutImage(e.target.value)} required className="rounded-xl" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Resume PDF Link</label>
                          <Input value={profResumeUrl} onChange={(e) => setProfResumeUrl(e.target.value)} required className="rounded-xl" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Social Handles */}
                    <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Social Links</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">GitHub URL</label>
                          <Input value={profGithub} onChange={(e) => setProfGithub(e.target.value)} required className="rounded-xl" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">LinkedIn URL</label>
                          <Input value={profLinkedin} onChange={(e) => setProfLinkedin(e.target.value)} required className="rounded-xl" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Facebook URL</label>
                          <Input value={profFacebook} onChange={(e) => setProfFacebook(e.target.value)} required className="rounded-xl" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Info Grid */}
                  <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quick Info Cards (Exactly 4 pairs)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {profQuickInfo.map((qi, idx) => (
                          <div key={qi.label} className="space-y-1 p-3 rounded-xl border border-border/30 bg-muted/10">
                            <span className="text-xs font-bold text-primary">{qi.label}</span>
                            <Input
                              value={qi.value}
                              onChange={(e) => handleQuickInfoChange(idx, e.target.value)}
                              placeholder={`Value for ${qi.label}`}
                              required
                              className="rounded-xl h-9 mt-1"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Repeatable Biography Paragraphs */}
                    <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Biography Paragraphs</CardTitle>
                        <Button type="button" size="sm" onClick={handleAddParagraph} className="cursor-pointer h-8 rounded-lg text-xs bg-muted/65 text-foreground hover:bg-muted">
                          <Plus className="h-3 w-3 mr-1" /> Add Paragraph
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {profAboutParagraphs.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-4">No paragraphs added. Click add above.</p>
                        ) : (
                          profAboutParagraphs.map((para, index) => (
                            <div key={index} className="flex gap-2 items-start">
                              <span className="font-mono text-xs text-muted-foreground mt-2 shrink-0">#{index + 1}</span>
                              <Textarea
                                value={para}
                                onChange={(e) => handleParagraphChange(index, e.target.value)}
                                placeholder="Write bio content..."
                                rows={3}
                                required
                                className="rounded-xl flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveParagraph(index)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    {/* Biography Skill Tags */}
                    <Card className="border-border bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Biography Skill Tags</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-1.5 p-3 min-h-[80px] rounded-xl border border-border/40 bg-muted/10">
                          {profAboutTags.length === 0 ? (
                            <span className="text-xs text-muted-foreground">No tags configured yet. Add them below.</span>
                          ) : (
                            profAboutTags.map((tag) => (
                              <Badge key={tag} className="bg-primary/20 text-foreground border border-primary/20 flex items-center gap-1 text-[10px] pl-2 pr-1.5 py-0.5">
                                <span>{tag}</span>
                                <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-destructive hover:bg-destructive/15 rounded-full p-0.5 cursor-pointer">
                                  <Lock className="h-2 w-2" /> {/* Small cross equivalent */}
                                </button>
                              </Badge>
                            ))
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Add New Tag</label>
                          <Input
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Type a tag (e.g. Next.js) and press Enter"
                            className="rounded-xl"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-border pt-6">
                    <Button type="submit" disabled={profileMutation.isPending} className="cursor-pointer rounded-xl bg-gradient-primary text-primary-foreground font-semibold px-6 shadow-soft hover:shadow-lift transition-all duration-300">
                      {profileMutation.isPending ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 3. PROJECTS SECTION */}
          {activeSection === "Projects" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-soft shrink-0">
                    <Code className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Projects Catalog</h2>
                    <p className="text-sm text-muted-foreground">Manage and feature the project items showcased in your portfolio</p>
                  </div>
                </div>

                <Button size="sm" onClick={() => { resetProjectForm(); setIsProjectDialogOpen(true); }} className="cursor-pointer bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" /> Add Project
                </Button>
              </div>

              {currentLoading ? (
                <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card/20">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : projects.length === 0 ? (
                <Card className="flex flex-col items-center justify-center text-center p-12 border-muted bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-muted grid place-items-center mb-4 text-muted-foreground">
                    <Code className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">No projects listed</CardTitle>
                  <CardDescription className="max-w-xs mt-1 mb-5">
                    Start showcasing your work! Click the button below to add your first project entry.
                  </CardDescription>
                  <Button onClick={() => { resetProjectForm(); setIsProjectDialogOpen(true); }} className="cursor-pointer">
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
                          <TableHead className="w-[120px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((p) => (
                          <TableRow key={p._id} className="border-border/60 hover:bg-muted/10 transition-colors group">
                            <TableCell className="align-middle font-mono text-sm font-semibold text-muted-foreground">{p.order}</TableCell>
                            <TableCell className="align-top py-4">
                              <div className="flex items-center gap-3.5">
                                <img src={p.image} alt={p.title} className="w-14 h-9 rounded-lg object-cover border border-border shrink-0 shadow-soft" />
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm text-foreground leading-tight">{p.title}</span>
                                  <div className="flex items-center gap-2.5 mt-2">
                                    <a href={p.live} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                                      Live <ExternalLink className="h-3 w-3" />
                                    </a>
                                    <span className="text-muted-foreground/45 text-xs">•</span>
                                    <a href={p.github} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                                      Code <Github className="h-3 w-3" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="align-top py-4 max-w-xs">
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{p.description}</p>
                            </TableCell>
                            <TableCell className="align-top py-4">
                              <div className="flex flex-wrap gap-1">
                                {p.tech.map((t) => (
                                  <Badge key={t} variant="secondary" className="text-[10px] px-2 py-0 border-border bg-secondary/30 text-secondary-foreground">
                                    {t}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="align-middle">
                              {p.featured ? (
                                <Badge className="bg-gradient-primary text-primary-foreground border-transparent text-[10px] shadow-soft">Featured</Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">Standard</span>
                              )}
                            </TableCell>
                            <TableCell className="align-middle text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button variant="ghost" size="icon" onClick={() => openEditProject(p)} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg cursor-pointer transition-colors">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors">
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
            </div>
          )}

          {/* 4. SKILLS SECTION */}
          {activeSection === "Skills" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-soft shrink-0">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Skills Database</h2>
                    <p className="text-sm text-muted-foreground">Manage technical categories, specific toolsets, and order items</p>
                  </div>
                </div>

                <Button size="sm" onClick={() => { resetSkillForm(); setIsSkillDialogOpen(true); }} className="cursor-pointer bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" /> Add Skill
                </Button>
              </div>

              {currentLoading ? (
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
                    Your toolbox is currently empty. Click the button below to add your first technical skill.
                  </CardDescription>
                  <Button onClick={() => { resetSkillForm(); setIsSkillDialogOpen(true); }} className="cursor-pointer">
                    Add first skill
                  </Button>
                </Card>
              ) : (
                <Accordion type="multiple" defaultValue={sortedCategoryKeys} className="space-y-4">
                  {sortedCategoryKeys.map((categoryName) => {
                    const categorySkills = groupedSkills[categoryName].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
                    return (
                      <AccordionItem
                        key={categoryName}
                        value={categoryName}
                        className="border border-border bg-card/30 backdrop-blur-md shadow-soft rounded-2xl overflow-hidden px-4 md:px-6"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-base text-foreground">{categoryName}</span>
                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 text-muted-foreground bg-muted/40 font-mono">
                              {categorySkills.length} skill{categorySkills.length === 1 ? "" : "s"}
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
                                      onClick={() => handleMoveSkill(categoryName, skill._id, "up")}
                                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                      <ArrowUp className="h-3 w-3" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={index === categorySkills.length - 1}
                                      onClick={() => handleMoveSkill(categoryName, skill._id, "down")}
                                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                      <ArrowDown className="h-3 w-3" />
                                    </button>
                                  </div>

                                  <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                      <span className="font-bold text-sm text-foreground">{skill.name}</span>
                                      <span className="text-[10px] font-semibold text-primary/80">{skill.level}% Proficiency</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1 break-words">{skill.description}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <Button variant="ghost" size="icon" onClick={() => openEditSkill(skill)} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/65 rounded-lg cursor-pointer">
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer">
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Skill?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete the skill "{skill.name}"? This cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteSkillMutation.mutate(skill._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
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
            </div>
          )}

          {/* 5. EXPERIENCE SECTION */}
          {activeSection === "Experience" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-soft shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Work History</h2>
                    <p className="text-sm text-muted-foreground">Manage and structure your past and present employment roles</p>
                  </div>
                </div>

                <Button size="sm" onClick={() => { resetExperienceForm(); setIsExperienceDialogOpen(true); }} className="cursor-pointer bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" /> Add Experience
                </Button>
              </div>

              {currentLoading ? (
                <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card/20">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : experiences.length === 0 ? (
                <Card className="flex flex-col items-center justify-center text-center p-12 border-muted bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-muted grid place-items-center mb-4 text-muted-foreground">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">No experience listed</CardTitle>
                  <CardDescription className="max-w-xs mt-1 mb-5">
                    No employment history entries exist yet. Click the button below to add your first work history node.
                  </CardDescription>
                  <Button onClick={() => { resetExperienceForm(); setIsExperienceDialogOpen(true); }} className="cursor-pointer">
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
                          <TableHead className="w-[180px]">Employment Duration</TableHead>
                          <TableHead>Key Responsibilities</TableHead>
                          <TableHead className="w-[120px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {experiences.map((exp) => (
                          <TableRow key={exp._id} className="border-border/60 hover:bg-muted/10 transition-colors group">
                            <TableCell className="align-middle font-mono text-sm font-semibold text-muted-foreground">{exp.order}</TableCell>
                            <TableCell className="align-middle py-4">
                              <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                                <Building2 className="h-4 w-4 text-primary shrink-0" />
                                {exp.company}
                              </span>
                            </TableCell>
                            <TableCell className="align-middle font-semibold text-sm">{exp.role}</TableCell>
                            <TableCell className="align-middle text-xs font-medium">
                              <span className="inline-flex items-center gap-1.5 bg-muted/60 px-2 py-0.5 rounded-md border border-border/30 text-muted-foreground">
                                {exp.duration}
                                {exp.current && <Badge className="text-[9px] px-1.5 py-0 bg-accent/20 text-accent-foreground border-transparent">Current</Badge>}
                              </span>
                            </TableCell>
                            <TableCell className="align-top py-4 max-w-sm">
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{exp.description}</p>
                            </TableCell>
                            <TableCell className="align-middle text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button variant="ghost" size="icon" onClick={() => openEditExperience(exp)} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg cursor-pointer transition-colors">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors">
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
            </div>
          )}

          {/* 6. EDUCATION SECTION */}
          {activeSection === "Education" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-soft shrink-0">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Academic Journey</h2>
                    <p className="text-sm text-muted-foreground">Manage and structure your past and present educational qualifications</p>
                  </div>
                </div>

                <Button size="sm" onClick={() => { resetEducationForm(); setIsEducationDialogOpen(true); }} className="cursor-pointer bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" /> Add Education
                </Button>
              </div>

              {currentLoading ? (
                <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card/20">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : education.length === 0 ? (
                <Card className="flex flex-col items-center justify-center text-center p-12 border-muted bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-muted grid place-items-center mb-4 text-muted-foreground">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">No education listed</CardTitle>
                  <CardDescription className="max-w-xs mt-1 mb-5">
                    Your academic timeline is empty. Click the button below to add your first education node.
                  </CardDescription>
                  <Button onClick={() => { resetEducationForm(); setIsEducationDialogOpen(true); }} className="cursor-pointer">
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
                          <TableHead className="w-[120px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {education.sort((a, b) => a.order - b.order).map((edu, index) => (
                          <TableRow key={edu._id} className="border-border/60 hover:bg-muted/10 transition-colors group">
                            <TableCell className="align-middle">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-sm font-semibold text-muted-foreground w-4">{edu.order}</span>
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
                                    disabled={index === education.length - 1}
                                    onClick={() => handleMoveEducation(edu._id, "down")}
                                    className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="align-middle">
                              <Badge className="bg-primary/20 text-foreground border border-primary/25 text-[10px]">{edu.year}</Badge>
                            </TableCell>
                            <TableCell className="align-middle font-bold text-sm">{edu.degree}</TableCell>
                            <TableCell className="align-middle font-semibold text-xs text-primary">{edu.institution}</TableCell>
                            <TableCell className="align-top py-4 max-w-sm">
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{edu.description}</p>
                            </TableCell>
                            <TableCell className="align-middle text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button variant="ghost" size="icon" onClick={() => openEditEducation(edu)} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg cursor-pointer transition-colors">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Education Entry?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete the education at "{edu.institution}"? This cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteEducationMutation.mutate(edu._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
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
            </div>
          )}
        </main>
      </div>

      {/* ----------------------------------------
          MODALS / DIALOGS
          ---------------------------------------- */}

      {/* Project Form Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl border-border bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Fill out the fields to showcase your project.</DialogDescription>
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
                <label className="text-xs font-semibold text-muted-foreground">Title</label>
                <Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="E.g. Task Manager" required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Display Order</label>
                <Input type="number" value={projectOrder} onChange={(e) => setProjectOrder(e.target.value)} placeholder="0" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Image URL</label>
              <Input value={projectImage} onChange={(e) => setProjectImage(e.target.value)} placeholder="https://i.ibb.co.com/..." required className="rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Description</label>
              <Textarea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} placeholder="Describe the application features..." rows={3} required className="rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Tech Stack (comma-separated list)</label>
              <Input value={projectTech} onChange={(e) => setProjectTech(e.target.value)} placeholder="React, Node.js, Express, MongoDB" required className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Live URL</label>
                <Input value={projectLive} onChange={(e) => setProjectLive(e.target.value)} placeholder="https://..." required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">GitHub URL</label>
                <Input value={projectGithub} onChange={(e) => setProjectGithub(e.target.value)} placeholder="https://github.com/..." required className="rounded-xl" />
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
              <Button type="button" variant="outline" onClick={() => setIsProjectDialogOpen(false)} className="cursor-pointer rounded-xl">Cancel</Button>
              <Button type="submit" className="cursor-pointer rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300">
                {projectMutation.isPending ? "Saving..." : "Save Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Skill Form Dialog */}
      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Fill out the fields to add a skill to your toolkit.</DialogDescription>
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
                <label className="text-xs font-semibold text-muted-foreground">Skill Name</label>
                <Input value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="E.g. TypeScript" required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Proficiency (0-100%)</label>
                <Input type="number" min="0" max="100" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} required className="rounded-xl" />
              </div>
            </div>

            {useCustomCategory ? (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground">Custom Category</label>
                  <button type="button" onClick={() => setUseCustomCategory(false)} className="text-[10px] text-primary hover:underline cursor-pointer">
                    Choose existing
                  </button>
                </div>
                <Input value={customCategoryName} onChange={(e) => setCustomCategoryName(e.target.value)} placeholder="E.g. Native Mobile Apps" required className="rounded-xl" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-muted-foreground">Category</label>
                    <button type="button" onClick={() => setUseCustomCategory(true)} className="text-[10px] text-primary hover:underline cursor-pointer">
                      Type custom
                    </button>
                  </div>
                  <Select value={skillCategory} onValueChange={setSkillCategory}>
                    <SelectTrigger className="w-full h-9 cursor-pointer rounded-xl">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(new Set([...DEFAULT_CATEGORIES, ...skills.map((s) => s.category)])).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Sort Order</label>
                  <Input type="number" value={skillOrder} onChange={(e) => setSkillOrder(e.target.value)} placeholder="0" className="rounded-xl" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Brief Description</label>
              <Textarea value={skillDesc} onChange={(e) => setSkillDesc(e.target.value)} placeholder="E.g. Code safety and type definitions..." rows={2} required className="rounded-xl" />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsSkillDialogOpen(false)} className="cursor-pointer rounded-xl">Cancel</Button>
              <Button type="submit" className="cursor-pointer rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300">
                {skillMutation.isPending ? "Saving..." : "Save Skill"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Experience Form Dialog */}
      <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{editingExperience ? "Edit Experience" : "Add New Experience"}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Fill out the fields to document a professional role.</DialogDescription>
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
                <label className="text-xs font-semibold text-muted-foreground">Company</label>
                <Input value={expCompany} onChange={(e) => setExpCompany(e.target.value)} placeholder="E.g. Mindsynth Technology" required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Role / Title</label>
                <Input value={expRole} onChange={(e) => setExpRole(e.target.value)} placeholder="E.g. Frontend Developer" required className="rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Duration string</label>
                <Input value={expDuration} onChange={(e) => setExpDuration(e.target.value)} placeholder="E.g. May 2025 – Present" required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Sort Order</label>
                <Input type="number" value={expOrder} onChange={(e) => setExpOrder(e.target.value)} placeholder="0" className="rounded-xl" />
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
              <label className="text-xs font-semibold text-muted-foreground">Job Description</label>
              <Textarea value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="Highlight your work and contributions..." rows={4} required className="rounded-xl" />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsExperienceDialogOpen(false)} className="cursor-pointer rounded-xl">Cancel</Button>
              <Button type="submit" className="cursor-pointer rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300">
                {experienceMutation.isPending ? "Saving..." : "Save Experience"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Education Form Dialog */}
      <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{editingEducation ? "Edit Education" : "Add New Education"}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Fill out the fields to document academic milestones.</DialogDescription>
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
                <label className="text-xs font-semibold text-muted-foreground">Degree / Program</label>
                <Input value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} placeholder="E.g. B.Sc. in Computer Science" required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Institution Name</label>
                <Input value={eduInstitution} onChange={(e) => setEduInstitution(e.target.value)} placeholder="E.g. State University" required className="rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Academic Year / Range</label>
                <Input value={eduYear} onChange={(e) => setEduYear(e.target.value)} placeholder="E.g. 2021 – 2025" required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Sort Order</label>
                <Input type="number" value={eduOrder} onChange={(e) => setEduOrder(e.target.value)} placeholder="0" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Milestone Description</label>
              <Textarea value={eduDesc} onChange={(e) => setEduDesc(e.target.value)} placeholder="Major academic achievements, CGPA, theses..." rows={4} required className="rounded-xl" />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEducationDialogOpen(false)} className="cursor-pointer rounded-xl">Cancel</Button>
              <Button type="submit" className="cursor-pointer rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300">
                {educationMutation.isPending ? "Saving..." : "Save Education"}
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

const categoryOrderList = ["Frontend", "Backend", "Database & ORM", "Tools", "Deployment"];
