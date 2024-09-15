import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    children?: React.ReactNode;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Input: React.FC<InputProps> = ({ className, value, onChange, children, ...props }) => {
    return (
        <div className={`relative ${className}`}>
            <input
                value={value}
                onChange={onChange}
                className="w-full text-[#00150D] outline-[#05B96E] border border-[#e5e7eb] rounded-lg px-4 py-2 bg-transparent text-sm"
                {...props}
            />
            {children && <div className="absolute inset-y-0 right-0 flex items-center pr-3">{children}</div>}
        </div>
    );
};

export default Input;