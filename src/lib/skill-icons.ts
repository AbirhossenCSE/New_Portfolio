import { IconType } from "react-icons";
import { FaAws } from "react-icons/fa6";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiGit,
  SiGithub,
  SiDocker,
  SiPython,
  SiFigma,
  SiVercel,
  SiFirebase,
  SiGraphql,
  SiPrisma,
  SiCplusplus,
  SiLinux,
  SiPostman,
  SiBun,
  SiVite,
  SiRust,
  SiGo,
  SiPhp,
  SiLaravel,
  SiRedux,
  SiSass,
  SiBootstrap,
  SiKubernetes,
  SiNginx,
  SiJest,
  SiCypress,
  SiFastapi,
  SiDjango,
  SiSpringboot,
} from "react-icons/si";
import { Code } from "lucide-react";

export const TECH_ICON_MAP: Record<string, IconType | any> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  Redis: SiRedis,
  Tailwind: SiTailwindcss,
  HTML: SiHtml5,
  CSS: SiCss,
  Git: SiGit,
  GitHub: SiGithub,
  Docker: SiDocker,
  Python: SiPython,
  Figma: SiFigma,
  Vercel: SiVercel,
  AWS: FaAws,
  Firebase: SiFirebase,
  GraphQL: SiGraphql,
  Prisma: SiPrisma,
  "C++": SiCplusplus,
  Linux: SiLinux,
  Postman: SiPostman,
  Bun: SiBun,
  Vite: SiVite,
  Rust: SiRust,
  Go: SiGo,
  PHP: SiPhp,
  Laravel: SiLaravel,
  Redux: SiRedux,
  Sass: SiSass,
  Bootstrap: SiBootstrap,
  Kubernetes: SiKubernetes,
  Nginx: SiNginx,
  Jest: SiJest,
  Cypress: SiCypress,
  FastAPI: SiFastapi,
  Django: SiDjango,
  "Spring Boot": SiSpringboot,
  Default: Code,
};

export const SKILL_ICON_NAMES = Object.keys(TECH_ICON_MAP);

export function getSkillIcon(iconName?: string, skillName?: string): IconType | any {
  // 1. Explicit icon selected by name
  if (iconName && TECH_ICON_MAP[iconName]) {
    return TECH_ICON_MAP[iconName];
  }

  // 2. Auto-detect by skill name (case insensitive match)
  if (skillName) {
    const sName = skillName.toLowerCase().trim();
    for (const key of SKILL_ICON_NAMES) {
      if (key === "Default") continue;
      const kLower = key.toLowerCase();
      if (sName.includes(kLower) || kLower.includes(sName)) {
        return TECH_ICON_MAP[key];
      }
    }
  }

  return Code;
}

export const SKILL_COLOR_MAP: Record<string, string> = {
  React: "#61DAFB",
  "React.js": "#61DAFB",
  "Next.js": "#38bdf8",
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  "Node.js": "#339933",
  Express: "#38bdf8",
  "Express.js": "#38bdf8",
  MongoDB: "#47A248",
  PostgreSQL: "#4169E1",
  MySQL: "#4479A1",
  Redis: "#DC382D",
  Tailwind: "#06B6D4",
  "Tailwind CSS": "#06B6D4",
  HTML: "#E34F26",
  HTML5: "#E34F26",
  CSS: "#1572B6",
  CSS3: "#1572B6",
  Git: "#F05032",
  GitHub: "#F05032",
  Docker: "#2496ED",
  Python: "#3776AB",
  Figma: "#F24E1E",
  Vercel: "#38bdf8",
  AWS: "#FF9900",
  Firebase: "#FFCA28",
  GraphQL: "#E10098",
  Prisma: "#2D3748",
  "C++": "#00599C",
  Linux: "#FCC624",
  Postman: "#FF6C37",
  Bun: "#FBF0DF",
  Vite: "#646CFF",
  Rust: "#DEA584",
  Go: "#00ADD8",
  PHP: "#777BB4",
  Laravel: "#FF2D20",
  Redux: "#764ABC",
  Sass: "#CC6699",
  Bootstrap: "#7952B3",
  Kubernetes: "#326CE5",
  Nginx: "#009639",
  Jest: "#C21325",
  Cypress: "#69D3A7",
  FastAPI: "#009688",
  Django: "#092E20",
  "Spring Boot": "#6DB33F",
};

export function getSkillColor(name?: string, icon?: string): string {
  if (name && SKILL_COLOR_MAP[name]) return SKILL_COLOR_MAP[name];
  if (icon && SKILL_COLOR_MAP[icon]) return SKILL_COLOR_MAP[icon];
  if (name) {
    const lname = name.toLowerCase();
    for (const [key, color] of Object.entries(SKILL_COLOR_MAP)) {
      if (lname.includes(key.toLowerCase())) return color;
    }
  }
  return "#38bdf8";
}
