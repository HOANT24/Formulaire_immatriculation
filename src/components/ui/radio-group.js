import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "../lib/utils";

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      {...props}
      className={cn(
        "relative h-0 w-0 rounded-full",
        "border-2 border-gray-600 bg-gray-100 border-[transparent]",
        "flex items-center justify-center",
        "data-[state=checked]:bg-transparent",
        "data-[state=checked]:border-[transparent]",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-[#840040]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{ borderRadius: "50px" }}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-4.5 w-4.5 fill-[#840040] text-[#840040]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
