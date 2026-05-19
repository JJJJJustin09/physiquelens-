"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { Report } from "@/lib/types";

type PriorityBarChartProps = {
  trainingPriority: Report["trainingPriority"];
  compact?: boolean;
};

const COLORS = ["#22d3ee", "#3b82f6", "#8b5cf6", "#38bdf8", "#64748b"];

export function PriorityBarChart({ trainingPriority, compact = false }: PriorityBarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const data = [
    { name: "Back", value: trainingPriority.back },
    { name: "Shoulders", value: trainingPriority.shoulders },
    { name: "Arms", value: trainingPriority.arms },
    { name: "Chest", value: trainingPriority.chest },
    { name: "Legs", value: trainingPriority.legs },
  ];

  if (!mounted) {
    return <div className={compact ? "h-44 w-full" : "h-72 w-full"} />;
  }

  return (
    <div className={compact ? "h-44 w-full" : "h-72 w-full"}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 6, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#94a3b8", fontSize: compact ? 10 : 12 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 40]}
            unit="%"
          />
          <YAxis
            type="category"
            dataKey="name"
            width={compact ? 68 : 82}
            tick={{ fill: "#cbd5e1", fontSize: compact ? 10 : 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
