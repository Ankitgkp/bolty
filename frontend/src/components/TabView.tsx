/**
 * Tab switcher for code/preview views.
 */

import { Code2, Eye } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <div className="flex items-center bg-[#1e1e1e] p-1 gap-1">
      <button
        onClick={() => onTabChange('code')}
        className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium transition-colors rounded-md ${activeTab === 'code'
            ? 'bg-[#2a2d2e] text-white shadow-sm'
            : 'text-[#808080] hover:text-[#cccccc] hover:bg-[#252526]'
          }`}
      >
        <Code2 className="w-3.5 h-3.5" />
        CODE
      </button>
      <button
        onClick={() => onTabChange('preview')}
        className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium transition-colors rounded-md ${activeTab === 'preview'
            ? 'bg-[#2a2d2e] text-white shadow-sm'
            : 'text-[#808080] hover:text-[#cccccc] hover:bg-[#252526]'
          }`}
      >
        <Eye className="w-3.5 h-3.5" />
        PREVIEW
      </button>
    </div>
  );
}