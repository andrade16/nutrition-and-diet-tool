"use client";

import { useState, useEffect, useRef } from "react";
import InfoIcon from "@/components/Icons/InfoIcon";
import styles from "./InfoTooltip.module.css";

interface InfoTooltipProps {
  text: string;
}

export default function InfoTooltip({ text }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible) return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible]);

  return (
    <span className={styles.wrapper} ref={wrapperRef}>
      <button
        className={styles.trigger}
        onClick={() => setVisible((v) => !v)}
        aria-label="More information"
      >
        <InfoIcon size={14} />
      </button>
      {visible && (
        <span className={styles.tooltip} role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}
