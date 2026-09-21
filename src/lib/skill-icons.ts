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
