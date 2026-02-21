'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectUserRole } from '@/store/slices/userSlice';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/search', label: 'Search' },
  { href: '/meal-planner', label: 'Meal Planner' },
  { href: '/assessment', label: 'Assessment', dietitianOnly: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const role = useAppSelector(selectUserRole);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href='/' className={styles.brand}>
          <span className={styles.brandIcon}>🥦</span>
          <span className={styles.brandName}>NutriTool</span>
        </Link>

        <ul className={styles.links}>
          {NAV_LINKS.filter(
            (link) => !link.dietitianOnly || role === 'dietitian'
          ).map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.link} ${pathname === link.href ? styles.linkActive : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.role}>
          {role && (
            <>
              <span className={styles.roleBadge}>
                {role === 'consumer' ? 'Consumer' : 'Dietitian'}
              </span>
              <Link href='/' className={styles.changeLink}>
                Change
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
