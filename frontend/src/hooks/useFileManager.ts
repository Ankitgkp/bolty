// hooks for managing file structure from build steps

import { useEffect, useState } from 'react';
import { Step, FileItem, StepType } from '../types';

export function useFileManager(steps: Step[], setSteps: React.Dispatch<React.SetStateAction<Step[]>>) {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

    useEffect(() => {
        const pendingSteps = steps.filter(({ status }) => status === "pending");

        if (pendingSteps.length > 0) {
            let newFiles = [...files];

            pendingSteps.forEach((step) => {
                if (step?.type === StepType.CreateFile && step.path) {
                    const pathParts = step.path.split("/").filter((p: string) => p !== "");
                    newFiles = updateFileStructure(newFiles, pathParts, step.code);
                }
            });

            setFiles(newFiles);
            setSteps((s) => s.map((step) => ({ ...step, status: "completed" as "completed" })));

            if (selectedFile) {
                const updatedSelectedFile = findFile(newFiles, selectedFile.path);
                if (updatedSelectedFile && updatedSelectedFile.content !== selectedFile.content) {
                    setSelectedFile(updatedSelectedFile);
                }
            }
        }
    }, [steps, files, selectedFile, setSteps]);

    return { files, selectedFile, setSelectedFile };
}

function updateFileStructure(nodes: FileItem[], parts: string[], code?: string): FileItem[] {
    if (parts.length === 0) return nodes;

    const [currentPart, ...remainingParts] = parts;
    const isLastPart = remainingParts.length === 0;
    const existingNodeIndex = nodes.findIndex((node) => node.name === currentPart);

    if (existingNodeIndex !== -1) {
        const existingNode = nodes[existingNodeIndex];
        const updatedNodes = [...nodes];

        if (isLastPart) {
            updatedNodes[existingNodeIndex] = { ...existingNode, content: code };
        } else {
            updatedNodes[existingNodeIndex] = {
                ...existingNode,
                children: updateFileStructure(existingNode.children || [], remainingParts, code),
            };
        }
        return updatedNodes;
    }

    if (isLastPart) {
        return [...nodes, {
            name: currentPart,
            type: "file",
            path: `/${parts.join("/")}`,
            content: code,
        }];
    }

    const newFolder: FileItem = {
        name: currentPart,
        type: "folder",
        path: `/${parts.slice(0, parts.indexOf(currentPart) + 1).join("/")}`,
        children: updateFileStructure([], remainingParts, code),
    };

    return [...nodes, newFolder];
}

function findFile(nodes: FileItem[], path: string): FileItem | null {
    for (const node of nodes) {
        if (node.path === path) return node;
        if (node.children) {
            const found = findFile(node.children, path);
            if (found) return found;
        }
    }
    return null;
}
