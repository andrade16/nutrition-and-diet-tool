import { getFoodById } from "@/lib/usda-api";
import FoodDetailView from "@/components/FoodDetail/FoodDetailView";
import FavoriteButton from "@/components/FavoriteButton/FavoriteButton";
import IngredientPill from "@/components/IngredientPill/IngredientPill";
import InfoTooltip from "@/components/InfoTooltip/InfoTooltip";
import { toTitleCase } from "@/lib/strings";
import styles from "./page.module.css";

interface FoodDetailPageProps {
  params: Promise<{ fdcId: string }>;
}

export default async function FoodDetailPage({ params }: FoodDetailPageProps) {
  const { fdcId } = await params;
  const food = await getFoodById(fdcId);

  const foodIngredients = food.ingredients
    ? [
        ...new Set(
          food.ingredients
            .split(",")
            .map((i) => toTitleCase(i.trim()).replace(".", "")),
        ),
      ]
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{toTitleCase(food.description)}</h1>
            <FavoriteButton
              food={food}
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
                  <span className={styles.servingStatValue}>
                    {food.householdServingFullText}
                  </span>
                </div>
              )}
              {food.servingSize && food.servingSizeUnit && (
                <div className={styles.servingStat}>
                  <span className={styles.servingStatLabel}>Weight</span>
                  <span className={styles.servingStatValue}>
                    {food.servingSize}
                    {food.servingSizeUnit.toLowerCase()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.servingInfo}>
          <div className={styles.sectionTitleRow}>
            <h2 className={styles.sectionTitle}>Ingredients</h2>
            <InfoTooltip text="Tap ★ on any ingredient to save it to your favorites" />
          </div>
          {foodIngredients ? (
            <ul className={styles.ingredientList}>
              {foodIngredients.map((ingredient) => (
                <IngredientPill key={ingredient} name={ingredient} />
              ))}
            </ul>
          ) : (
            <p className={styles.serving}>No ingredients listed</p>
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
