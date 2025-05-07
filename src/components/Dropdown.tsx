'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";

interface DropdownItem {
  icon: string;
  label: string;
  href: string;
}

interface DropdownProps {
  icon: string;
  label: string;
  items: DropdownItem[];
}

export default function Dropdown({ icon, label, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative group w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : "false"}
      >
        <Image src={icon} alt={label} width={20} height={20} className="min-w-[20px]" />
        <span className="hidden lg:block">{t(label)}</span>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          role="menu"
        >
          <div className="py-1">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={18}
                  height={18}
                  className="min-w-[18px]"
                />
                <span>{t(item.label)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
