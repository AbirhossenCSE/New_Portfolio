import { useState } from "react";

export function ExpandableText({
  text,
  maxLength = 120,
}: {
  text: string;
  maxLength?: number;
}) {
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
