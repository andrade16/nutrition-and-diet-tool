import type { FavoriteItem } from "@/lib/types/usda";
import FoodListItem from "@/components/FoodListItem/FoodListItem";
import NoteInput from "@/components/NoteInput/NoteInput";
import styles from "./FavoriteCategoryGroup.module.css";

interface FavoriteCategoryGroupProps {
  category: string;
  items: FavoriteItem[];
  isDietitian: boolean;
}

export default function FavoriteCategoryGroup({
  category,
  items,
  isDietitian,
}: FavoriteCategoryGroupProps) {
  return (
    <section className={styles.group}>
      <div className={styles.header}>
        <h2 className={styles.title}>{category}</h2>
        <span className={styles.count}>{items.length}</span>
      </div>
      <div className={styles.items}>
        {items.map((item) => (
          <div key={item.fdcId} className={`${styles.foodEntry}${isDietitian ? ` ${styles.foodEntryWithNote}` : ""}`}>
            <FoodListItem food={item} />
            {isDietitian && <NoteInput fdcId={item.fdcId} />}
          </div>
        ))}
      </div>
    </section>
  );
}
