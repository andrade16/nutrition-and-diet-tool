"use client";

import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { FoodDetailNutrient } from "@/lib/types/usda";

interface MacroDonutChartProps {
  protein?: FoodDetailNutrient;
  carbs?: FoodDetailNutrient;
  fat?: FoodDetailNutrient;
}

// Calories per gram
const CAL_PER_G = { protein: 4, carbs: 4, fat: 9 };

const COLORS = {
  Protein: "#3b82f6",
  Carbs: "#f59e0b",
  Fat: "#10b981",
};

export default function MacroDonutChart({
  protein,
  carbs,
  fat,
}: MacroDonutChartProps) {
  const data = [
    { name: "Protein", calories: (protein?.amount ?? 0) * CAL_PER_G.protein, fill: COLORS.Protein },
    { name: "Carbs",   calories: (carbs?.amount   ?? 0) * CAL_PER_G.carbs,   fill: COLORS.Carbs },
    { name: "Fat",     calories: (fat?.amount      ?? 0) * CAL_PER_G.fat,     fill: COLORS.Fat },
  ].filter((d) => d.calories > 0);

  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.calories, 0);

  return (
    <ResponsiveContainer width='100%' height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey='calories'
          nameKey='name'
          cx='50%'
          cy='50%'
          innerRadius={70}
          outerRadius={100}
          paddingAngle={3}
        />

        <Tooltip
          formatter={(value: number | undefined, name: string | undefined) => [
            value !== undefined
              ? `${Math.round(value)} kcal (${Math.round((value / total) * 100)}%)`
              : "—",
            name ?? "",
          ]}
        />
        <Legend
          formatter={(value, entry) => {
            const item = data.find((d) => d.name === value);
            return `${value} — ${Math.round(((item?.calories ?? 0) / (CAL_PER_G[value.toLowerCase() as keyof typeof CAL_PER_G] ?? 1)) * 10) / 10}g`;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
