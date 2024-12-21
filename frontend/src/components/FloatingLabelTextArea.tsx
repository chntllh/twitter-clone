import { useCallback, useEffect, useRef, useState } from "react";

type FloatingLabelTextAreaProps = {
  id: string;
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  rows: number;
  maxLength: number;
  adjustableHeight: boolean;
}

const FloatingLabelTextArea = ({
  id = "",
  label = "",
  value = "",
  onChange,
  rows = 3,
  maxLength = 50,
  adjustableHeight = false,
}: FloatingLabelTextAreaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Adjust height of textarea only
  const adjustHeight = useCallback(() => {
    if (adjustableHeight && inputRef.current) {
      inputRef.current.style.height = "auto"; // Reset height to calculate new size
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // Adjust height
    }
  }, [adjustableHeight]);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight, value]);

  const handleInputChange = (e: any) => {
    onChange(e);
    adjustHeight();
  };

  return (
    <div className="relative w-full">
      <textarea
        id={id}
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        maxLength={maxLength}
        style={{ boxSizing: "border-box" }}
        rows={rows}
        placeholder=""
        className={`peer w-full p-3 h-14 bg-black border border-gray-700 rounded-md outline-none 
          focus:ring-2 focus:ring-blue-500 pt-6 resize-none overflow-hidden leading-5`}
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
};

FloatingLabelTextArea.displayName = "FloatingLabelTextArea";

export default FloatingLabelTextArea;
