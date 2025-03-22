"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight } from "lucide-react";

interface DropdownProps {
  icon: string;
  label: string;
  items: { label: string; href: string }[];
}

const Dropdown: React.FC<DropdownProps> = ({ icon, label, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Dropdown Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-500 rounded-md hover:bg-LamaSkyLight"
      >
        <div className="flex items-center gap-4">
          <Image src={icon} alt={label} width={20} height={20} />
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Dropdown Items */}
      {isOpen && (
        <ul className="mt-2 ml-6 space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <Link href={item.href} className="block px-4 py-1 text-gray-500 hover:bg-LamaSkyLight">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
