// ai model selector dropdown 

import { Dropdown, DropdownItem } from '../ui';

interface ModelSelectorProps {
    selectedModel: string;
}

export function ModelSelector({ selectedModel }: ModelSelectorProps) {
    const trigger = (
        <button
            type="button"
            className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 rounded-md transition-colors"
        >
            <span>{selectedModel}</span>
            <span className="text-[10px] opacity-75">▼</span>
        </button>
    );

    return (
        <Dropdown trigger={trigger}>
            <DropdownItem disabled badge="Soon">Claude</DropdownItem>
            <DropdownItem disabled badge="Soon">Gemini</DropdownItem>
        </Dropdown>
    );
}
