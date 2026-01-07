/**
 * Reusable Input component with consistent styling.
 */

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'dark';
}

const variantStyles = {
    default: 'bg-white border-gray-300 text-gray-800 placeholder-gray-400',
    dark: 'bg-[#252526] border-[#3c3c3c] text-gray-200 placeholder-gray-500'
};

export function Input({ 
    variant = 'default', 
    className = '', 
    ...props 
}: InputProps) {
    const baseStyles = 'w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500 transition-colors';
    
    return (
        <input
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        />
    );
}
