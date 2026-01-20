import React from "react";
import { Check } from "lucide-react";

export const Checkbox = ({
  id,
  className,
  checked = false,
  onCheckedChange,
}) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center cursor-pointer ${className}`}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`h-4 w-4 flex items-center justify-center border border-gray-400 rounded-sm transition-colors ${
          checked ? "bg-blue-600 text-white" : "bg-white text-transparent"
        }`}
      >
        <Check className="h-4 w-4" />
      </div>
    </label>
  );
};
