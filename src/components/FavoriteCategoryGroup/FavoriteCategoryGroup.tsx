import type { FavoriteItem } from "@/lib/types/usda";
import FoodListItem from "@/components/FoodListItem/FoodListItem";
import styles from "./FavoriteCategoryGroup.module.css";

interface FavoriteCategoryGroupProps {
  category: string;
  items: FavoriteItem[];
}

export default function FavoriteCategoryGroup({
  category,
  items,
}: FavoriteCategoryGroupProps) {
  console.log("RENDERING CATEGORY:", category);
  console.log("ITEMS IN CATEGORY:", items);
  return (
    <section className={styles.group}>
      <div className={styles.header}>
        <h2 className={styles.title}>{category}</h2>
        <span className={styles.count}>{items.length}</span>
      </div>
      <div className={styles.items}>
        {items.map((item) => (
          <FoodListItem key={item.fdcId} food={item} />
        ))}
      </div>
    </section>
  );
}
