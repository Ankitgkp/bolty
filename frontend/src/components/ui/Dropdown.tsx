/**
 * Dropdown menu component with toggle functionality.
 */

import { ReactNode, useState, useRef, useEffect } from 'react';

interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    className?: string;
}

interface DropdownItemProps {
    children: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    badge?: string;
}

export function Dropdown({ trigger, children, className = '' }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="p-1">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

export function DropdownItem({ children, disabled, onClick, badge }: DropdownItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left text-gray-600 hover:bg-gray-50 rounded-md transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span>{children}</span>
            {badge && (
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                    {badge}
                </span>
            )}
        </button>
    );
}
