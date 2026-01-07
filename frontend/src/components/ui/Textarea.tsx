/**
 * Reusable Textarea component with consistent styling.
 */

import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: 'default' | 'dark';
}

const variantStyles = {
    default: 'bg-transparent text-gray-800 placeholder-gray-400',
    dark: 'bg-[#252526] border border-[#3c3c3c] text-gray-200 placeholder-gray-500'
};

export function Textarea({ 
    variant = 'default', 
    className = '', 
    ...props 
}: TextareaProps) {
    const baseStyles = 'w-full rounded-lg outline-none resize-none transition-colors focus:border-blue-500';
    
    return (
        <textarea
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        />
    );
}
