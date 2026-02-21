import { getFoodById } from "@/lib/usda";
import FoodDetailView from "@/components/FoodDetail/FoodDetailView";
import styles from "./page.module.css";

interface FoodDetailPageProps {
  params: Promise<{ fdcId: string }>;
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function FoodDetailPage({ params }: FoodDetailPageProps) {
  console.log("FoodDetailPage params: ", params);
  const { fdcId } = await params;
  const food = await getFoodById(fdcId);

  const calories = food.foodNutrients.find((n) => n.nutrient.name === "Energy");
  const protein = food.foodNutrients.find((n) => n.nutrient.name === "Protein");
  const carbs = food.foodNutrients.find(
    (n) => n.nutrient.name === "Carbohydrate, by difference",
  );
  const fat = food.foodNutrients.find(
    (n) => n.nutrient.name === "Total lipid (fat)",
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{toTitleCase(food.description)}</h1>
          {food.brandOwner && <p className={styles.brand}>{food.brandOwner}</p>}
          {food.foodCategory && (
            <p className={styles.category}>{food.foodCategory}</p>
          )}
        </div>

        <div className={styles.servingInfo}>
          <h2 className={styles.sectionTitle}>Serving Size</h2>
          <p className={styles.serving}>
            {food.servingSize && food.servingSizeUnit
              ? `${food.servingSize}${food.servingSizeUnit.toLowerCase()}`
              : (food.householdServingFullText ?? "Not specified")}
          </p>
        </div>

        <div className={styles.nutrition}>
          <h2 className={styles.sectionTitle}>Nutrition Facts</h2>
          <FoodDetailView
            food={food}
            calories={calories}
            protein={protein}
            carbs={carbs}
            fat={fat}
          />
        </div>
      </div>
    </div>
  );
}
