import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type FloatingLabelInputProps = {
  id: string;
  label: string;
  type: "text" | "password" | "email";
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  maxLength?: number;
  error?: string;
};

const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(
  (
    {
      id = "",
      label = "",
      type = "text",
      value = "",
      onChange,
      maxLength = 50,
      error = "",
    }: FloatingLabelInputProps,
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const [inputType, setInputType] = useState(type);

    useEffect(() => {
      setInputType(type);
    }, [type]);

    const handlePasswordShowToggle = () => {
      inputType === "password"
        ? setInputType("text")
        : setInputType("password");
    };

    return (
      <div className="relative w-full flex items-center mb-8">
        <input
          id={id}
          type={inputType}
          ref={ref}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          placeholder=""
          className={`peer w-full p-3 h-14 bg-black border border-gray-700 rounded-md outline-none 
          ${
            error ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-blue-500"
          } pt-6`}
        />

        <label
          htmlFor={id}
          className={`absolute left-3 transition-all duration-300 ease-in-out pointer-events-none
            ${
              error
                ? "text-red-500"
                : `${isFocused ? "text-blue-500" : "text-gray-500"}`
            }
            ${isFocused || value ? "top-1 text-xs" : "top-4 text-base"}`}
        >
          {label}
        </label>
        {type === "password" && (
          <span
            className="absolute right-3 cursor-pointer"
            onClick={handlePasswordShowToggle}
          >
            {inputType === "password" ? (
              <AiOutlineEye size={20} />
            ) : (
              <AiOutlineEyeInvisible size={20} />
            )}
          </span>
        )}
        {error && (
          <p
            id={`${id}-error`}
            className="absolute -bottom-6 left-3 text-sm text-red-500"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export default FloatingLabelInput;
