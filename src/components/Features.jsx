import React from "react";
import { useTranslation } from "react-i18next";

export default function Features() {
  const { t } = useTranslation();

  const grid = [
    { key: "homework_sharing", title: t("features.homework_sharing.title"), description: t("features.homework_sharing.description") },
    { key: "collaborative_problem_solving", title: t("features.collaborative_problem_solving.title"), description: t("features.collaborative_problem_solving.description") },
    { key: "resource_exchange", title: t("features.resource_exchange.title"), description: t("features.resource_exchange.description") },
    { key: "discussion_forums", title: t("features.discussion_forums.title"), description: t("features.discussion_forums.description") },
    { key: "ai", title: t("features.ai.title"), description: t("features.ai.description") },
    { key: "study_planning", title: t("features.study_planning.title"), description: t("features.study_planning.description") },
    { key: "file_uploads_sharing", title: t("features.file_uploads_sharing.title"), description: t("features.file_uploads_sharing.description") },
    { key: "community_driven_support", title: t("features.community_driven_support.title"), description: t("features.community_driven_support.description") },
  ];

  return (
    <div className="py-10 lg:py-40 bg-black" id="features">
      <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white leading-[3.25rem] relative inline-block">
  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg opacity-30"></span>
  <span className="relative">{t("features.title")}</span>
</h2>
        </div>
      <div className="dark grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-2 max-w-7xl mx-auto">
        {grid.map((feature) => (
          <div key={feature.key} className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden">
            <Grid />
            <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">{feature.title}</p>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4 text-base font-normal relative z-20">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Grid = () => {
  // Use a static pattern to avoid random generation on each render
  const staticPattern = [
    [9, 2], [10, 3], [8, 4], [11, 5], [7, 1],
  ];

  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern width={20} height={20} x="-12" y="4" squares={staticPattern} className="absolute inset-0 h-full w-full mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10" />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }) {
  // Remove useId since the pattern is static and doesn't need unique IDs per instance
  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id="grid-pattern" width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#grid-pattern)`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y], index) => (
            <rect
              strokeWidth="0"
              key={index} // Simplify key since pattern is static
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}