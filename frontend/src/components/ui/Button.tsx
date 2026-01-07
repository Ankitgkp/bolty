/**
 * Reusable Button component with multiple variants and sizes.
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-black hover:bg-gray-800 text-white',
    ghost: 'hover:bg-black/5 text-gray-700',
    icon: 'flex items-center justify-center'
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5'
};

export function Button({ 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    disabled,
    children, 
    ...props 
}: ButtonProps) {
    const baseStyles = 'rounded-lg font-medium transition-colors disabled:opacity-50';
    
    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
