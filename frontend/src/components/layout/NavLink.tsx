// nav link with optional dropdown indicator

import { ReactNode } from 'react';

interface NavLinkProps {
    href: string;
    children: ReactNode;
    hasDropdown?: boolean;
}

export function NavLink({ href, children, hasDropdown }: NavLinkProps) {
    return (
        <a 
            href={href} 
            className="hover:text-black transition-colors flex items-center gap-1"
        >
            {children}
            {hasDropdown && <span className="text-[10px] opacity-75">▼</span>}
        </a>
    );
}
