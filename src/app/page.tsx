import RolePrompt from "@/components/RolePrompt/RolePrompt";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Nutrition & Diet Tool</h1>
        <p className={styles.description}>
          Track your meals, monitor your nutrition, and achieve your health
          goals.
        </p>
        <RolePrompt />
      </main>
    </div>
  );
}
