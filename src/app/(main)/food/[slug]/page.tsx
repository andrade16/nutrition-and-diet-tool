import { getFoodById } from "@/lib/usda";
import type { FoodItem } from "@/lib/types/usda";
import styles from "./page.module.css";

interface FoodDetailPageProps {
  params: Promise<{ slug: string }>;
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function FoodDetailPage({ params }: FoodDetailPageProps) {
  const { slug } = await params;
  const food: FoodItem = await getFoodById(slug);

  console.log("Food data:", food);
  console.log("All nutrients:", food.foodNutrients);

  // Get key macronutrients
  const calories = food.foodNutrients.find(
    (n) => n.nutrientName === "Energy"
  )?.value;
  console.log("Calories found:", calories);

  const protein = food.foodNutrients.find(
    (n) => n.nutrientName === "Protein"
  )?.value;
  console.log("Protein found:", protein);

  const carbs = food.foodNutrients.find(
    (n) => n.nutrientName === "Carbohydrate, by difference"
  )?.value;
  console.log("Carbs found:", carbs);

  const fat = food.foodNutrients.find(
    (n) => n.nutrientName === "Total lipid (fat)"
  )?.value;
  console.log("Fat found:", fat);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{toTitleCase(food.description)}</h1>
          {food.brandOwner && (
            <p className={styles.brand}>{food.brandOwner}</p>
          )}
          {food.foodCategory && (
            <p className={styles.category}>{food.foodCategory}</p>
          )}
        </div>

        <div className={styles.servingInfo}>
          <h2 className={styles.sectionTitle}>Serving Size</h2>
          {food.servingSize && food.servingSizeUnit ? (
            <p className={styles.serving}>
              {food.servingSize}
              {food.servingSizeUnit.toLowerCase()}
            </p>
          ) : food.householdServingFullText ? (
            <p className={styles.serving}>{food.householdServingFullText}</p>
          ) : (
            <p className={styles.serving}>Not specified</p>
          )}
        </div>

        <div className={styles.nutrition}>
          <h2 className={styles.sectionTitle}>Nutrition Facts</h2>
          <div className={styles.macros}>
            {calories !== undefined && (
              <div className={styles.macro}>
                <span className={styles.macroLabel}>Calories</span>
                <span className={styles.macroValue}>
                  {Math.round(calories)} kcal
                </span>
              </div>
            )}
            {protein !== undefined && (
              <div className={styles.macro}>
                <span className={styles.macroLabel}>Protein</span>
                <span className={styles.macroValue}>{protein.toFixed(1)}g</span>
              </div>
            )}
            {carbs !== undefined && (
              <div className={styles.macro}>
                <span className={styles.macroLabel}>Carbs</span>
                <span className={styles.macroValue}>{carbs.toFixed(1)}g</span>
              </div>
            )}
            {fat !== undefined && (
              <div className={styles.macro}>
                <span className={styles.macroLabel}>Fat</span>
                <span className={styles.macroValue}>{fat.toFixed(1)}g</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.metadata}>
          <p className={styles.dataType}>Data Type: {food.dataType}</p>
          <p className={styles.fdcId}>FDC ID: {food.fdcId}</p>
        </div>
      </div>
    </div>
  );
}
