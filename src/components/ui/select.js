"use client";

import React from "react";
import { cn } from "../lib/utils"; // si tu utilises toujours ta fonction cn

export default function SimpleSelect({
  value,
  onChange,
  options,
  placeholder,
  error,
}) {
  return (
    <div data-error={!!error} className="w-full">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          " h-11 w-full border-2 rounded-md bg-white px-3 py-2 text-sm transition-all duration-200",
          error
            ? "border-red-300 focus:ring-red-100"
            : "border-gray-200 hover:border-[#840040]/30 focus:border-[#840040] focus:ring-4 focus:ring-[#840040]/10"
        )}
      >
        <option value="" disabled>
          {placeholder || "Sélectionnez une option..."}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export { SimpleSelect };
