// hooks for mounting files to webcontainer

import { useEffect } from 'react';
import { WebContainer } from '@webcontainer/api';
import { FileItem } from '../types';

export function useWebContainerMount(files: FileItem[], webcontainer?: WebContainer) {
    useEffect(() => {
        if (!webcontainer || files.length === 0) return;

        const mountStructure = createMountStructure(files);
        webcontainer.mount(mountStructure);
    }, [files, webcontainer]);
}

function createMountStructure(files: FileItem[]): Record<string, any> {
    const mountStructure: Record<string, any> = {};

    const processFile = (file: FileItem, isRootFolder: boolean): any => {
        if (file.type === "folder") {
            mountStructure[file.name] = {
                directory: file.children
                    ? Object.fromEntries(
                        file.children.map((child: FileItem) => [child.name, processFile(child, false)])
                    )
                    : {},
            };
        } else if (file.type === "file") {
            if (isRootFolder) {
                mountStructure[file.name] = { file: { contents: file.content || "" } };
            } else {
                return { file: { contents: file.content || "" } };
            }
        }
        return mountStructure[file.name];
    };

    files.forEach((file) => processFile(file, true));
    return mountStructure;
}
