import React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

export const Checkbox = ({ id, className, checked, onCheckedChange }) => {
  return (
    <label
      htmlFor={id}
      className={cn("inline-flex items-center cursor-pointer", className)}
    >
      {/* Input caché */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      {/* Case visible */}
      <div
        className={cn(
          "h-4 w-4 flex items-center justify-center border border-primary rounded-sm transition-colors",
          checked ? "bg-primary text-white" : "bg-white text-transparent"
        )}
      >
        <Check className="h-4 w-4" />
      </div>
    </label>
  );
};
