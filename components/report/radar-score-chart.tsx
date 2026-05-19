"use client";

import { useEffect, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { Report } from "@/lib/types";

const order: Array<{ label: string; key: keyof Report["scores"] }> = [
  { label: "V-taper", key: "vTaper" },
  { label: "Shoulders", key: "shoulders" },
  { label: "Back", key: "back" },
  { label: "Chest", key: "chest" },
  { label: "Arms", key: "arms" },
  { label: "Legs", key: "legs" },
  { label: "Symmetry", key: "symmetry" },
  { label: "Definition", key: "definition" },
];

type RadarScoreChartProps = {
  scores: Report["scores"];
  compact?: boolean;
};

export function RadarScoreChart({ scores, compact = false }: RadarScoreChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const data = order.map((item) => ({
    metric: item.label,
    score: scores[item.key],
  }));

  if (!mounted) {
    return <div className={compact ? "h-44 w-full" : "h-72 w-full"} />;
  }

  return (
    <div className={compact ? "h-44 w-full" : "h-72 w-full"}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius={compact ? "68%" : "78%"}>
          <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#94a3b8", fontSize: compact ? 10 : 12 }}
            tickLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            fill="rgba(34, 211, 238, 0.35)"
            stroke="#22d3ee"
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
