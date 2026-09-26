import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MagicContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const MagicContainer: React.FC<MagicContainerProps> = ({
  children,
  className,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-3xl p-[1px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift",
        className
      )}
      style={{
        background: isHovered
          ? `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, #9E7AFF, #38bdf8, #FF5C5C, #FE8BBB, transparent 80%)`
          : "rgba(255, 255, 255, 0.08)", // Faint border for non-hovered state
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default MagicContainer;
