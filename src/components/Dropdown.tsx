"use client";

import type React from "react";

interface HallDropdownProps {
  value: string;
  onChange: (value: string) => void;
  hint: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  sourceData: any[];
}

const Dropdown: React.FC<HallDropdownProps> = ({
  value,
  onChange,
  error,
  required = false,
  className = "",
  hint,
  label,
  sourceData,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor="hall"
        className="block text-sm font-medium text-[#475569] mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        {/* <Home className="absolute left-0 top-0 bottom-0" /> */}
        <select
          id="hall"
          name="hall"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`block w-full px-3 py-2.5 border ${
            error ? "border-red-500" : "border-[#cbd5e1]"
          } rounded-lg shadow-sm focus:outline-none focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] text-sm text-[#1e293b] appearance-none`}
        >
          <option value="" disabled>
            {hint}
          </option>
          {sourceData.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value="Other">Other (Off-campus)</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Dropdown;
