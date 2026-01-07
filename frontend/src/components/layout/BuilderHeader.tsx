// nav cum header for builder page

import { ReactNode } from 'react';
import { Button } from '../ui';

interface BuilderHeaderProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
}

export function BuilderHeader({ title, subtitle, children }: BuilderHeaderProps) {
    return (
        <header className="bg-[#1e1e1e] border-b border-[#333] px-6 py-3 flex flex-shrink-0 items-center justify-between">
            <div>
                <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                    <span className="text-blue-400">{title}</span>
                    {subtitle && (
                        <>
                            <span className="opacity-50 text-sm font-normal">/</span>
                            <span className="text-sm font-normal text-gray-400 truncate max-w-[300px]">
                                {subtitle}
                            </span>
                        </>
                    )}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                {children}
                <PublishButton />
            </div>
        </header>
    );
}

function PublishButton() {
    return (
        <Button variant="primary" size="sm" className="text-xs">
            Publish
        </Button>
    );
}
