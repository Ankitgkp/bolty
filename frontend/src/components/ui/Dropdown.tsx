/**
 * Dropdown menu component with toggle functionality.
 */

import { ReactNode, useState, useRef, useEffect, ButtonHTMLAttributes } from 'react';

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
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#2a2a2a] border border-gray-600 rounded-lg shadow-xl">
                    <div className="p-1" onClick={() => setIsOpen(false)}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

// ... imports

interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    badge?: string;
    // className is already included in ButtonHTMLAttributes, but explicit definition is fine too if we want to override documentation
}

export function DropdownItem({ children, badge, className = '', ...props }: DropdownItemProps) {
    return (
        <button
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left text-gray-200 hover:bg-gray-700 rounded-md transition-colors ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            {...props}
        >
            <span>{children}</span>
            {badge && (
                <span className="text-[10px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">
                    {badge}
                </span>
            )}
        </button>
    );
}
