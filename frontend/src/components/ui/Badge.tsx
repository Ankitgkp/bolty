/**
 * Badge component for displaying labels and tags.
 */

import { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'outline' | 'muted';
    className?: string;
}

const variantStyles = {
    default: 'bg-[#E5E3D5] border-[#D6D4C5] text-gray-600',
    outline: 'bg-transparent border-gray-800 text-gray-600',
    muted: 'bg-gray-100 text-gray-500'
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${variantStyles[variant]} ${className}`}>
            {children}
        </span>
    );
}
