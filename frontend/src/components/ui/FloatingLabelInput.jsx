import React, { useState } from "react";

const FloatingLabelInput = React.forwardRef(
  (
    {
      id = "",
      label = "",
      type = "text",
      value = "",
      onChange,
      maxLength = 50,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative w-full">
        <input
          id={id}
          type={type}
          ref={ref}
          value={value}
          onChange={(e) => onChange(e)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          placeholder=""
          className={`peer w-full p-3 h-14 bg-black border border-gray-700 rounded-md outline-none 
          focus:ring-2 focus:ring-blue-500 pt-6`}
        />

        <label
          htmlFor={id}
          className={`absolute left-3 transition-all duration-300 ease-in-out pointer-events-none 
          ${isFocused ? "text-blue-500" : "text-gray-500"}
          ${isFocused || value ? "top-1 text-xs" : "top-4 text-base"}`}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export default FloatingLabelInput;
