// webcontainer preview panel 

import { WebContainer } from '@webcontainer/api';
import { PreviewFrame } from '../PreviewFrame';
import { FileItem } from '../../types';

interface PreviewPanelProps {
    webContainer?: WebContainer;
    files: FileItem[];
    isGenerating?: boolean;
}

export function PreviewPanel({ webContainer, files, isGenerating = false }: PreviewPanelProps) {
    return (
        <div className="flex-1 overflow-auto relative">
            <PreviewFrame webContainer={webContainer} files={files} />
            {isGenerating && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-yellow-500/90 backdrop-blur-sm text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border border-yellow-400">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm font-medium">Please wait, building your project...</span>
                    </div>
                </div>
            )}
        </div>
    );
}