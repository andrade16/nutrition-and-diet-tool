"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUserRole, selectUserRole } from "@/store/slices/user/userSlice";
import styles from "./RolePrompt.module.css";

type Role = "consumer" | "dietitian";

export default function RolePrompt() {
  const dispatch = useAppDispatch();
  const role = useAppSelector(selectUserRole);
  const router = useRouter();
  const [isSelecting, setIsSelecting] = useState(false);

  const selectRole = (selected: Role) => {
    setIsSelecting(true);
    dispatch(setUserRole(selected));
    router.push("/search");
  };

  const clearRole = () => dispatch(setUserRole(null));

  if (role && !isSelecting) {
    return (
      <div className={styles.selectedState}>
        <span className={styles.selectedLabel}>
          Browsing as{" "}
          <strong>{role === "consumer" ? "Consumer" : "Dietitian"}</strong>
        </span>
        <button className={styles.changeBtn} onClick={clearRole}>
          Change
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.heading}>Who&apos;s using NutriTool today?</p>
      <div className={styles.cards}>
        <button className={styles.card} onClick={() => selectRole("consumer")}>
          <span className={styles.icon}>🧑</span>
          <h3 className={styles.cardTitle}>I&apos;m tracking my diet</h3>
          <p className={styles.cardDesc}>
            Get simple, clear nutritional info for your meals and daily goals
          </p>
        </button>
        <button className={styles.card} onClick={() => selectRole("dietitian")}>
          <span className={styles.icon}>👩‍⚕️</span>
          <h3 className={styles.cardTitle}>I&apos;m a dietitian</h3>
          <p className={styles.cardDesc}>
            Access full micronutrient breakdowns and professional tools for
            clients
          </p>
        </button>
      </div>
      <p className={styles.hint}>You can change this anytime</p>
    </div>
  );
}
