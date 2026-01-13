// ai model selector dropdown 

import { useState, useEffect } from 'react';
import { Dropdown, DropdownItem } from '../ui';

interface ModelSelectorProps {
    model: string;
    setModel: (model: string) => void;
}

export function ModelSelector({ model, setModel }: ModelSelectorProps) {
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(false), 1000);
        return () => clearTimeout(timer);
    }, []);
    
    const models = [
        { id: 'xiaomi/mimo-v2-flash:free', name: 'Xiaomi Mimo V2' },
        { id: 'mistralai/devstral-2512:free', name: 'Mistral Devstral' },
    ];

    const selectedModelName = models.find(m => m.id === model)?.name || model;

    const handleModelSelect = (id: string) => {
        setModel(id);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
    };

    const trigger = (
        <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 bg-[#2a2a2a] hover:bg-[#333] rounded-full transition-all relative overflow-hidden"
            style={isAnimating ? {
                background: 'linear-gradient(#2a2a2a, #2a2a2a) padding-box, linear-gradient(to right, #ec4899, #8b5cf6, #3b82f6) border-box',
                border: '1px solid transparent',
            } : { border: '1px solid transparent' }}
        >
            <span className="relative z-10">{selectedModelName}</span>
            <span className="text-[10px] opacity-75 relative z-10">▼</span>
            {isAnimating && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shimmer_1s_infinite]" />
            )}
        </button>
    );

    return (
        <Dropdown trigger={trigger}>
            {models.map(m => (
                <DropdownItem 
                    key={m.id}
                    onClick={() => handleModelSelect(m.id)}
                    className={model === m.id ? 'bg-blue-500/10 text-blue-400' : ''}
                >
                    <div className="flex items-center justify-between w-full">
                        <span>{m.name}</span>
                    </div>
                </DropdownItem>
            ))}
            <DropdownItem disabled badge="Soon">Claude</DropdownItem>
            <DropdownItem disabled badge="Soon">Gemini</DropdownItem>
        </Dropdown>
    );
}
