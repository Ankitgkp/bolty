// webcontainer preview panel 

import { WebContainer } from '@webcontainer/api';
import { PreviewFrame } from '../PreviewFrame';
import { FileItem } from '../../types';

interface PreviewPanelProps {
    webContainer?: WebContainer;
    files: FileItem[];
}

export function PreviewPanel({ webContainer, files }: PreviewPanelProps) {
    return (
        <div className="flex-1 overflow-auto">
            <PreviewFrame webContainer={webContainer} files={files} />
        </div>
    );
}
