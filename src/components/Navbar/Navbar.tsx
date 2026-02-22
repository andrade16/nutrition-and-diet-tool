"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUserRole, setUserRole } from "@/store/slices/userSlice";
import styles from "./Navbar.module.css";
import Chevron from "../Icons/Chevron";

type Role = "consumer" | "dietitian";

const NAV_LINKS = [
  { href: "/search", label: "Search" },
  { href: "/favorites", label: "Favorites" },
  { href: "/chat", label: "AI Chat" },
];

const ROLES: { value: Role; label: string }[] = [
  { value: "consumer", label: "Consumer" },
  { value: "dietitian", label: "Dietitian" },
];

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const role = useAppSelector(selectUserRole);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleSelect = (selected: Role) => {
    dispatch(setUserRole(selected));
    setIsOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href='/' className={styles.brand}>
          <span className={styles.brandIcon}>🥦</span>
          <span className={styles.brandName}>NutriTool</span>
        </Link>

        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.link} ${pathname === link.href ? styles.linkActive : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {role && (
          <div className={styles.roleMenu} ref={dropdownRef}>
            <button
              className={styles.roleTrigger}
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
            >
              {role === "consumer" ? "Consumer" : "Dietitian"}
              <Chevron
                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
              />
            </button>

            {isOpen && (
              <div className={styles.dropdown}>
                {ROLES.map(({ value, label }) => (
                  <button
                    key={value}
                    className={`${styles.dropdownItem} ${role === value ? styles.dropdownItemActive : ""}`}
                    onClick={() => handleRoleSelect(value)}
                  >
                    <span className={styles.dropdownDot} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
