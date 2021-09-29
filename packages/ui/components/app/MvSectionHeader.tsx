import Link from "next/link";
import React, { Children } from "react";

const MvSectionHeader: React.FC<{ linkTitle?: string; link?: string }> = ({
  linkTitle,
  link,
  children,
}) => {
  return (
    <div className="pb-5 mb-5 border-b border-gray-200 sm:flex  sm:items-center sm:justify-between">
      {children?children:<div></div>}
      {link && linkTitle && (
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link href={link}>
            <a className="btn">
              {linkTitle}
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MvSectionHeader;
