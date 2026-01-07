/**
 * IconButton component for icon-only buttons.
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
    primary: 'bg-[#D08F74] hover:bg-[#c08269] text-white disabled:bg-gray-200',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white',
    ghost: 'hover:text-black text-gray-600'
};

const sizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
};

export function IconButton({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '',
    disabled,
    ...props 
}: IconButtonProps) {
    return (
        <button
            className={`flex items-center justify-center rounded-lg transition-all disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
