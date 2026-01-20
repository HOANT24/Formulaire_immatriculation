import * as React from "react";
import { cn } from "../lib/utils";

const RadioGroupContext = React.createContext(null);

const RadioGroup = ({ value, onValueChange, className, children }) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={cn(className)}>{children}</div>
    </RadioGroupContext.Provider>
  );
};

const RadioGroupItem = ({ value, id, className }) => {
  const context = React.useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem must be used inside RadioGroup");
  }

  const { value: selectedValue, onValueChange } = context;
  const checked = selectedValue === value;

  return (
    <input
      type="radio"
      id={id}
      name="radio-group"
      checked={checked}
      onChange={() => onValueChange(value)}
      className={cn(
        "relative h-5 w-5 cursor-pointer appearance-none rounded-full border-2",
        "border-gray-400 checked:border-[#840040]",
        "after:absolute after:inset-1 after:rounded-full after:bg-[#840040]",
        "after:opacity-0 checked:after:opacity-100",
        "transition-all",
        className
      )}
    />
  );
};

export { RadioGroup, RadioGroupItem };
