import { getFoodById } from "@/lib/usda";
import FoodDetailView from "@/components/FoodDetail/FoodDetailView";
import FavoriteButton from "@/components/FavoriteButton/FavoriteButton";
import { toTitleCase } from "@/lib/strings";
import styles from "./page.module.css";

interface FoodDetailPageProps {
  params: Promise<{ fdcId: string }>;
}

export default async function FoodDetailPage({ params }: FoodDetailPageProps) {
  const { fdcId } = await params;
  const food = await getFoodById(fdcId);
  console.log("Food detail data ===> ", food);

  const foodIngredients =
    food.ingredients?.split(",") ?? "No ingredients listed";

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{toTitleCase(food.description)}</h1>
            <FavoriteButton
              fdcId={food.fdcId}
              className={styles.favoriteBtn}
              showLabel
              iconSize={28}
            />
          </div>
          {food.brandOwner && <p className={styles.brand}>{food.brandOwner}</p>}
          {food.foodCategory && (
            <p className={styles.category}>{food.foodCategory}</p>
          )}
        </div>

        <div className={styles.servingInfo}>
          <h2 className={styles.sectionTitle}>Serving Size</h2>
          {!food.householdServingFullText && !food.servingSize ? (
            <p className={styles.serving}>Not specified</p>
          ) : (
            <div className={styles.servingRow}>
              {food.householdServingFullText && (
                <div className={styles.servingStat}>
                  <span className={styles.servingStatLabel}>Household</span>
                  <span className={styles.servingStatValue}>{food.householdServingFullText}</span>
                </div>
              )}
              {food.servingSize && food.servingSizeUnit && (
                <div className={styles.servingStat}>
                  <span className={styles.servingStatLabel}>Weight</span>
                  <span className={styles.servingStatValue}>{food.servingSize}{food.servingSizeUnit.toLowerCase()}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.servingInfo}>
          <h2 className={styles.sectionTitle}>Ingredients</h2>
          {Array.isArray(foodIngredients) ? (
            <ul className={styles.ingredientList}>
              {foodIngredients.map((ingredient, index) => (
                <li key={index}>
                  {toTitleCase(ingredient.trim()).replace(".", "")}
                </li>
              ))}
            </ul>
          ) : (
            foodIngredients
          )}
        </div>

        <div className={styles.nutrition}>
          <h2 className={styles.sectionTitle}>Nutrition Facts</h2>
          <FoodDetailView food={food} />
        </div>
      </div>
    </div>
  );
}
