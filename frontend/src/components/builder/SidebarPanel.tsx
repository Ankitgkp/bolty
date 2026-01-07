// sidebar panel for builder page for steps for generating the files

import { ReactNode } from 'react';

interface SidebarPanelProps {
    children: ReactNode;
}

export function SidebarPanel({ children }: SidebarPanelProps) {
    return (
        <div className="col-span-2 border-r border-[#333] bg-[#1a1a1a] flex flex-col min-h-0">
            {children}
        </div>
    );
}

interface SidebarContentProps {
    children: ReactNode;
}

export function SidebarContent({ children }: SidebarContentProps) {
    return (
        <div className="flex-1 overflow-auto p-4">
            {children}
        </div>
    );
}
