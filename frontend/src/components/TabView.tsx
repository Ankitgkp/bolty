/**
 * Tab switcher for code/preview views.
 */

import { Code2, Eye } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
  disabled?: boolean;
}

export function TabView({ activeTab, onTabChange, disabled = false }: TabViewProps) {
  
  const handlePreviewClick = () => {
    if (!disabled) {
      onTabChange('preview');
    }
  };

  return (
    <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1 gap-1">
      <button
        onClick={() => onTabChange('code')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors rounded-md ${activeTab === 'code'
            ? 'bg-white text-black'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
      >
        <Code2 className="w-3.5 h-3.5" />
        Code
      </button>
      <button
        onClick={handlePreviewClick}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors rounded-md ${
          disabled 
            ? 'text-gray-600 cursor-not-allowed opacity-50 bg-gray-900' 
            : activeTab === 'preview'
            ? 'bg-white text-black'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        title={disabled ? 'Wait for code generation to complete' : 'Preview'}
      >
        <Eye className="w-3.5 h-3.5" />
        Preview
      </button>
    </div>
  );
}