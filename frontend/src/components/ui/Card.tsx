/**
 * Card component for content containers.
 */

import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-300 ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }: CardProps) {
    return (
        <div className={`p-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }: CardProps) {
    return (
        <div className={`px-3 pb-3 ${className}`}>
            {children}
        </div>
    );
}
