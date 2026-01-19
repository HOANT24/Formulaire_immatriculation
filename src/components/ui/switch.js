import React from "react";

export function Switch({ id, className, checked, onCheckedChange }) {
  return (
    <label
      htmlFor={id}
      className={`relative inline-block w-10 h-5 cursor-pointer ${className}`}
    >
      {/* Le fond du switch */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="opacity-0 w-0 h-0"
      />
      <span
        className={`absolute left-0 top-0 h-5 w-10 rounded-full transition-colors
        ${checked ? "bg-[#840040]" : "bg-gray-300"}`}
      ></span>
      {/* Le bouton qui glisse */}
      <span
        className={`absolute left-0 top-0 h-5 w-5 bg-white rounded-full shadow transform transition-transform
        ${checked ? "translate-x-5" : "translate-x-0"}`}
      ></span>
    </label>
  );
}
