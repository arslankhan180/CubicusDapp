import React, { useState } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  children?: React.ReactNode;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  maxLength?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  className,
  value,
  onChange,
  children,
  maxLength,
  ...props
}) => {
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    if (onChange) {
      onChange(e); // Call the passed onChange handler
    }
  };

  return (
    <div className={`relative ${className}`}>
      <textarea
        value={value}
        rows={4}
        maxLength={maxLength}
        onChange={handleChange}
        className="w-full text-[#00150D] outline-none border border-[#e5e7eb] rounded-lg px-4 py-2 bg-transparent text-sm"
        {...props}
      />
      {children && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {children}
        </div>
      )}
      {/* Character limit display */}
      {maxLength && (
        <div className="text-right text-xs text-black mt-1">
          {charCount}/{maxLength} characters limit
        </div>
      )}
    </div>
  );
};

export default TextArea;
