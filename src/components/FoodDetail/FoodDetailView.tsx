"use client";

import { useAppSelector } from "@/store/hooks";
import { selectUserRole } from "@/store/slices/userSlice";
import type { FoodDetail, FoodDetailNutrient } from "@/lib/types/usda";
import MacroDonutChart from "./MacroDonutChart";
import styles from "./FoodDetailView.module.css";

interface FoodDetailViewProps {
  food: FoodDetail;
}

export default function FoodDetailView({ food }: FoodDetailViewProps) {
  const role = useAppSelector(selectUserRole);

  const calories = food.foodNutrients.find((n) => n.nutrient.name === "Energy");
  const protein  = food.foodNutrients.find((n) => n.nutrient.name === "Protein");
  const carbs    = food.foodNutrients.find((n) => n.nutrient.name === "Carbohydrate, by difference");
  const fat      = food.foodNutrients.find((n) => n.nutrient.name === "Total lipid (fat)");
  const fiber    = food.foodNutrients.find((n) => n.nutrient.name === "Fiber, total dietary");
  const sugar    = food.foodNutrients.find((n) => n.nutrient.name === "Sugars, total including NLEA");
  const sodium   = food.foodNutrients.find((n) => n.nutrient.name === "Sodium, Na");
  const satFat   = food.foodNutrients.find((n) => n.nutrient.name === "Fatty acids, total saturated");

  if (role === "dietitian") {
    return <DietitianView food={food} protein={protein} carbs={carbs} fat={fat} />;
  }

  return (
    <ConsumerView
      calories={calories}
      protein={protein}
      carbs={carbs}
      fat={fat}
      fiber={fiber}
      sugar={sugar}
      sodium={sodium}
      satFat={satFat}
    />
  );
}

// ─── Consumer View ────────────────────────────────────────────────────────────

interface ConsumerViewProps {
  calories?: FoodDetailNutrient;
  protein?:  FoodDetailNutrient;
  carbs?:    FoodDetailNutrient;
  fat?:      FoodDetailNutrient;
  fiber?:    FoodDetailNutrient;
  sugar?:    FoodDetailNutrient;
  sodium?:   FoodDetailNutrient;
  satFat?:   FoodDetailNutrient;
}

function ConsumerView({ calories, protein, carbs, fat, fiber, sugar, sodium, satFat }: ConsumerViewProps) {
  const secondary = [
    { label: "Fiber",      nutrient: fiber,  unit: "g",  format: (v: number) => v.toFixed(1) },
    { label: "Sugar",      nutrient: sugar,  unit: "g",  format: (v: number) => v.toFixed(1) },
    { label: "Sodium",     nutrient: sodium, unit: "mg", format: (v: number) => Math.round(v).toString() },
    { label: "Sat. Fat",   nutrient: satFat, unit: "g",  format: (v: number) => v.toFixed(1) },
  ];

  return (
    <>
      <div className={styles.macros}>
        <MacroCard label="Calories" value={calories !== undefined ? `${Math.round(calories.amount)} kcal` : "—"} />
        <MacroCard label="Protein"  value={protein  !== undefined ? `${protein.amount.toFixed(1)}g`        : "—"} />
        <MacroCard label="Carbs"    value={carbs    !== undefined ? `${carbs.amount.toFixed(1)}g`           : "—"} />
        <MacroCard label="Fat"      value={fat      !== undefined ? `${fat.amount.toFixed(1)}g`             : "—"} />
      </div>
      <ul className={styles.secondaryList}>
        {secondary.map(({ label, nutrient, unit, format }) => (
          <li key={label} className={styles.secondaryRow}>
            <span className={styles.secondaryLabel}>{label}</span>
            <span className={styles.secondaryValue}>
              {nutrient !== undefined ? `${format(nutrient.amount)}${unit}` : "—"}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function MacroCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.macro}>
      <span className={styles.macroLabel}>{label}</span>
      <span className={styles.macroValue}>{value}</span>
    </div>
  );
}

// ─── Dietitian View ───────────────────────────────────────────────────────────

interface DietitianViewProps {
  food:      FoodDetail;
  protein?:  FoodDetailNutrient;
  carbs?:    FoodDetailNutrient;
  fat?:      FoodDetailNutrient;
}

function DietitianView({ food, protein, carbs, fat }: DietitianViewProps) {
  return (
    <>
      <MacroDonutChart protein={protein} carbs={carbs} fat={fat} />
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Nutrient</th>
            <th className={styles.th}>Amount</th>
            <th className={styles.th}>Unit</th>
          </tr>
        </thead>
        <tbody>
          {food.foodNutrients.map((n) => (
            <tr key={n.id} className={styles.tr}>
              <td className={styles.td}>{n.nutrient.name}</td>
              <td className={`${styles.td} ${styles.tdValue}`}>{n.amount ?? "—"}</td>
              <td className={`${styles.td} ${styles.tdUnit}`}>{n.nutrient.unitName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
