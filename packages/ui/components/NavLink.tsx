import React from "react";
import Link from "next/link";

import styles from "./NavLink.module.css";

interface NavLinkProps {
  icon: React.ReactElement;
  href: string;
  handleClick?: () => void;
  children: React.ReactNode;
}

function NavLink({ icon, href, handleClick, children }: NavLinkProps) {
  return (
    <div className={styles.subNavDiv}>
      <Link href={href}>
        <a className={styles.navLink} onClick={handleClick}>
          {icon}
          {children}
        </a>
      </Link>
    </div>
  );
}

export default NavLink;
