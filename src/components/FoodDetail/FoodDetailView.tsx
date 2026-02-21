"use client";

import { useAppSelector } from "@/store/hooks";
import { selectUserRole } from "@/store/slices/userSlice";
import type { FoodDetail, FoodDetailNutrient } from "@/lib/types/usda";
import styles from "./FoodDetailView.module.css";

interface FoodDetailViewProps {
  food: FoodDetail;
  calories?: FoodDetailNutrient;
  protein?: FoodDetailNutrient;
  carbs?: FoodDetailNutrient;
  fat?: FoodDetailNutrient;
}

export default function FoodDetailView({
  food,
  calories,
  protein,
  carbs,
  fat,
}: FoodDetailViewProps) {
  const role = useAppSelector(selectUserRole);
  console.log("ROLE ===> ", role);

  if (role === "dietitian") {
    return <DietitianView food={food} />;
  }

  return (
    <ConsumerView
      calories={calories}
      protein={protein}
      carbs={carbs}
      fat={fat}
    />
  );
}

// ─── Consumer View ────────────────────────────────────────────────────────────

interface ConsumerViewProps {
  calories?: FoodDetailNutrient;
  protein?: FoodDetailNutrient;
  carbs?: FoodDetailNutrient;
  fat?: FoodDetailNutrient;
}

function ConsumerView({ calories, protein, carbs, fat }: ConsumerViewProps) {
  console.log("ConsumerView render: ", { calories, protein, carbs, fat });
  return (
    <div className={styles.macros}>
      <MacroCard
        label='Calories'
        value={
          calories !== undefined ? `${Math.round(calories.amount)} kcal` : "—"
        }
      />
      <MacroCard
        label='Protein'
        value={protein !== undefined ? `${protein.amount.toFixed(1)}g` : "—"}
      />
      <MacroCard
        label='Carbs'
        value={carbs !== undefined ? `${carbs.amount.toFixed(1)}g` : "—"}
      />
      <MacroCard
        label='Fat'
        value={fat !== undefined ? `${fat.amount.toFixed(1)}g` : "—"}
      />
    </div>
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

function DietitianView({ food }: { food: FoodDetail }) {
  console.log("DietitianView render: ", food);
  return (
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
            <td className={`${styles.td} ${styles.tdValue}`}>
              {n.amount ?? "—"}
            </td>
            <td className={`${styles.td} ${styles.tdUnit}`}>
              {n.nutrient.unitName}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
