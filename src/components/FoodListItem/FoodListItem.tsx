import Link from 'next/link';
import type { FoodItem } from '@/lib/types/usda';
import styles from './FoodListItem.module.css';

interface FoodListItemProps {
  food: FoodItem;
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FoodListItem({ food }: FoodListItemProps) {
  const serving =
    food.servingSize && food.servingSizeUnit
      ? `${food.servingSize}${food.servingSizeUnit.toLowerCase()}`
      : null;

  return (
    <Link href={`/food/${food.fdcId}`} className={styles.card}>
      <div className={styles.text}>
        <h3 className={styles.name}>{toTitleCase(food.description)}</h3>
        <p className={styles.meta}>
          {[food.brandOwner, food.foodCategory].filter(Boolean).join(' · ')}
        </p>
      </div>

      <div className={styles.right}>
        {serving && <span className={styles.serving}>{serving}</span>}
        <svg
          className={styles.arrow}
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polyline points='9 18 15 12 9 6' />
        </svg>
      </div>
    </Link>
  );
}
