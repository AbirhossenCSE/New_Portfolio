import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  User,
  Code,
  Layers,
  Briefcase,
  GraduationCap,
  LayoutGrid,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "./AdminAuthContext";
import MessagesSection from "./sections/MessagesSection";
import ProfileSection from "./sections/ProfileSection";
import ProjectsSection from "./sections/ProjectsSection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import EducationSection from "./sections/EducationSection";

type ActiveSectionType =
  "Messages" | "Profile" | "Projects" | "Skills" | "Experience" | "Education";

export default function AdminLayout() {
  const { handleLogout } = useAdminAuth();
  const [activeSection, setActiveSection] =
    useState<ActiveSectionType>("Messages");
  const queryClient = useQueryClient();

  const getQueryKeyForSection = (section: ActiveSectionType) => {
    if (section === "Experience") return "experiences";
    return section.toLowerCase();
  };

  const isFetching =
    queryClient.isFetching({
      queryKey: [getQueryKeyForSection(activeSection)],
    }) > 0;

  const handleRefetch = () => {
    queryClient.invalidateQueries({
      queryKey: [getQueryKeyForSection(activeSection)],
    });
  };

  const sidebarLinks = [
    {
      id: "Messages" as const,
      label: "Messages",
      icon: MessageSquare,
      description: "Contact submissions",
    },
    {
      id: "Profile" as const,
      label: "Profile",
      icon: User,
      description: "Personal details & bio",
    },
    {
      id: "Projects" as const,
      label: "Projects",
      icon: Code,
      description: "Portfolio showcase",
    },
    {
      id: "Skills" as const,
      label: "Skills",
      icon: Layers,
      description: "Technical toolbox",
    },
    {
      id: "Experience" as const,
      label: "Experience",
      icon: Briefcase,
      description: "Work history",
    },
    {
      id: "Education" as const,
      label: "Education",
      icon: GraduationCap,
      description: "Academic timeline",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.06),rgba(255,255,255,0))]" />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/40 backdrop-blur-lg p-6 fixed h-screen z-30 justify-between">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" /> Admin Panel
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
              Portfolio Manager
            </p>
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
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-300",
                      isActive ? "" : "group-hover:scale-110",
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{link.label}</span>
                    <span
                      className={cn(
                        "text-[9px] font-normal leading-none mt-0.5",
                        isActive
                          ? "text-primary-foreground/75"
                          : "text-muted-foreground/75",
                      )}
                    >
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
            <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-bold">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Administrator</span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                Secure Session
              </span>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl text-xs py-2 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* MOBILE HEADER & SCROLLABLE NAV */}
      <div className="md:hidden flex flex-col border-b border-border bg-card/40 backdrop-blur-lg sticky top-0 z-30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
              Admin Console
            </h1>
            <p className="text-[9px] text-muted-foreground leading-none">
              CMS Dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefetch}
              className="cursor-pointer"
              disabled={isFetching}
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="cursor-pointer"
            >
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
                    : "text-muted-foreground bg-muted/40 hover:text-foreground",
                )}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <main className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {activeSection === "Messages" && <MessagesSection />}
          {activeSection === "Profile" && <ProfileSection />}
          {activeSection === "Projects" && <ProjectsSection />}
          {activeSection === "Skills" && <SkillsSection />}
          {activeSection === "Experience" && <ExperienceSection />}
          {activeSection === "Education" && <EducationSection />}
        </main>
      </div>
    </div>
  );
}
