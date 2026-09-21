import React, { useEffect, useState, memo } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiGit,
  SiDocker,
} from "react-icons/si";
import { Code2 } from "lucide-react";

export type TechType =
  | "react"
  | "next"
  | "typescript"
  | "javascript"
  | "node"
  | "express"
  | "mongodb"
  | "tailwind"
  | "html"
  | "css"
  | "git"
  | "docker";

export interface SkillOrbitConfig {
  id: string;
  orbitRadius: number;
  size: number;
  speed: number;
  techType: TechType;
  phaseShift: number;
  label: string;
  color: string;
}

const techMap: Record<
  TechType,
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  react: { icon: SiReact, color: "#61DAFB" },
  next: { icon: SiNextdotjs, color: "#FFFFFF" },
  typescript: { icon: SiTypescript, color: "#3178C6" },
  javascript: { icon: SiJavascript, color: "#F7DF1E" },
  node: { icon: SiNodedotjs, color: "#339933" },
  express: { icon: SiExpress, color: "#EEEEEE" },
  mongodb: { icon: SiMongodb, color: "#47A248" },
  tailwind: { icon: SiTailwindcss, color: "#06B6D4" },
  html: { icon: SiHtml5, color: "#E34F26" },
  css: { icon: SiCss, color: "#1572B6" },
  git: { icon: SiGit, color: "#F05032" },
  docker: { icon: SiDocker, color: "#2496ED" },
};

const defaultSkillsConfig: SkillOrbitConfig[] = [
  // Inner Orbit (Radius: 90px)
  {
    id: "html",
    orbitRadius: 90,
    size: 38,
    speed: 0.9,
    techType: "html",
    phaseShift: 0,
    label: "HTML5",
    color: "#E34F26",
  },
  {
    id: "css",
    orbitRadius: 90,
    size: 38,
    speed: 0.9,
    techType: "css",
    phaseShift: (2 * Math.PI) / 3,
    label: "CSS3",
    color: "#1572B6",
  },
  {
    id: "javascript",
    orbitRadius: 90,
    size: 38,
    speed: 0.9,
    techType: "javascript",
    phaseShift: (4 * Math.PI) / 3,
    label: "JavaScript",
    color: "#F7DF1E",
  },

  // Middle Orbit (Radius: 155px)
  {
    id: "react",
    orbitRadius: 155,
    size: 44,
    speed: -0.6,
    techType: "react",
    phaseShift: 0,
    label: "React",
    color: "#61DAFB",
  },
  {
    id: "next",
    orbitRadius: 155,
    size: 42,
    speed: -0.6,
    techType: "next",
    phaseShift: (2 * Math.PI) / 4,
    label: "Next.js",
    color: "#FFFFFF",
  },
  {
    id: "typescript",
    orbitRadius: 155,
    size: 42,
    speed: -0.6,
    techType: "typescript",
    phaseShift: (4 * Math.PI) / 4,
    label: "TypeScript",
    color: "#3178C6",
  },
  {
    id: "tailwind",
    orbitRadius: 155,
    size: 42,
    speed: -0.6,
    techType: "tailwind",
    phaseShift: (6 * Math.PI) / 4,
    label: "Tailwind CSS",
    color: "#06B6D4",
  },

  // Outer Orbit (Radius: 220px)
  {
    id: "node",
    orbitRadius: 220,
    size: 46,
    speed: 0.45,
    techType: "node",
    phaseShift: 0,
    label: "Node.js",
    color: "#339933",
  },
  {
    id: "express",
    orbitRadius: 220,
    size: 42,
    speed: 0.45,
    techType: "express",
    phaseShift: (2 * Math.PI) / 4,
    label: "Express",
    color: "#EEEEEE",
  },
  {
    id: "mongodb",
    orbitRadius: 220,
    size: 44,
    speed: 0.45,
    techType: "mongodb",
    phaseShift: (4 * Math.PI) / 4,
    label: "MongoDB",
    color: "#47A248",
  },
  {
    id: "git",
    orbitRadius: 220,
    size: 42,
    speed: 0.45,
    techType: "git",
    phaseShift: (6 * Math.PI) / 4,
    label: "Git",
    color: "#F05032",
  },
];

const SkillIcon = memo(({ techType }: { techType: TechType }) => {
  const IconComp = techMap[techType]?.icon;
  return IconComp ? <IconComp /> : null;
});
SkillIcon.displayName = "SkillIcon";

const OrbitingSkillItem = memo(
  ({ config, angle }: { config: SkillOrbitConfig; angle: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { orbitRadius, size, techType, label } = config;
    const itemColor = techMap[techType]?.color || "#FF9933";

    const x = Math.cos(angle) * orbitRadius;
    const y = Math.sin(angle) * orbitRadius;

    return (
      <div
        className="absolute top-1/2 left-1/2 transition-all duration-200 ease-out"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
          zIndex: isHovered ? 30 : 10,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`relative w-full h-full p-2.5 bg-card/90 border border-border/80 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer text-xl ${
            isHovered ? "scale-125 border-primary shadow-lift" : "shadow-soft hover:border-primary/50"
          }`}
          style={{
            color: itemColor,
            boxShadow: isHovered
              ? `0 0 25px ${itemColor}60, 0 0 50px ${itemColor}30`
              : undefined,
          }}
        >
          <SkillIcon techType={techType} />

          {isHovered && (
            <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-popover/95 border border-border text-popover-foreground shadow-card backdrop-blur-md rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none z-50">
              {label}
            </div>
          )}
        </div>
      </div>
    );
  },
);
OrbitingSkillItem.displayName = "OrbitingSkillItem";

const OrbitPath = memo(
  ({ radius, color = "#FF9933" }: { radius: number; color?: string }) => {
    return (
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
        }}
      >
        {/* Soft orbital line */}
        <div
          className="absolute inset-0 rounded-full border border-border/40"
          style={{
            boxShadow: `inset 0 0 15px ${color}15, 0 0 15px ${color}15`,
          }}
        />
        {/* Animated pulse ring */}
        <div
          className="absolute inset-0 rounded-full animate-pulse opacity-30"
          style={{
            border: `1px dashed ${color}`,
          }}
        />
      </div>
    );
  },
);
OrbitPath.displayName = "OrbitPath";

export function OrbitingSkillsAnimation({
  centerImage,
}: {
  centerImage?: string;
}) {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setTime((prevTime) => prevTime + deltaTime);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <div
      className="relative w-full aspect-square max-w-[480px] mx-auto flex items-center justify-center select-none scale-[0.72] xs:scale-[0.88] sm:scale-100 transform-gpu my-[-40px] xs:my-[-20px] sm:my-0 transition-transform duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Central Hub Orb / Avatar */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center z-20 shadow-card border-2 border-primary/40 bg-card p-1">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <div className="absolute -inset-2 rounded-full bg-gradient-primary opacity-30 blur-2xl" />

        {centerImage ? (
          <img
            src={centerImage}
            alt="Center Hub"
            className="w-full h-full rounded-full object-cover relative z-10"
          />
        ) : (
          <div className="relative z-10 grid h-full w-full place-items-center rounded-full bg-gradient-primary text-primary-foreground">
            <Code2 className="h-9 w-9" />
          </div>
        )}
      </div>

      {/* Render 3 Orbit Paths */}
      <OrbitPath radius={90} color="#FF9933" />
      <OrbitPath radius={155} color="#06B6D4" />
      <OrbitPath radius={220} color="#9333EA" />

      {/* Render Orbiting Skills */}
      {defaultSkillsConfig.map((config) => {
        const angle = time * config.speed + (config.phaseShift || 0);
        return (
          <OrbitingSkillItem key={config.id} config={config} angle={angle} />
        );
      })}
    </div>
  );
}
