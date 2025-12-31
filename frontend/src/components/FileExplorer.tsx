import { useState } from 'react';
import { FolderTree, File, ChevronRight, ChevronDown } from 'lucide-react';
import { FileItem } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  selectedFile?: FileItem | null;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
  selectedFile?: FileItem | null;
}

function FileNode({ item, depth, onFileClick, selectedFile }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  const isSelected = selectedFile?.path === item.path;

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer transition-colors duration-150 ${isSelected ? 'bg-[#37373d] text-[#00aaff]' : 'text-[#cccccc]'
          }`}
        style={{ paddingLeft: `${depth * 1.2 + 0.5}rem` }}
        onClick={handleClick}
      >
        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
          {item.type === 'folder' && (
            <span className="text-[#808080]">
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </span>
          )}
        </span>
        <span className="flex-shrink-0">
          {item.type === 'folder' ? (
            <FolderTree className="w-4 h-4 text-[#dcb67a]" />
          ) : (
            <File className="w-4 h-4 text-[#519aba]" />
          )}
        </span>
        <span className="text-sm truncate">{item.name}</span>
      </div>
      {item.type === 'folder' && isExpanded && item.children && (
        <div className="mt-0.5">
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect, selectedFile }: FileExplorerProps) {
  return (
    <div className="bg-[#1e1e1e] h-full overflow-hidden flex flex-col border-r border-[#1e1e1e]">
      <div className="px-3 py-2 border-b border-[#1e1e1e] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[#808080] flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5" />
            Files
          </h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#252526] border border-[#3c3c3c] text-[#cccccc] text-[11px] px-2 py-1 rounded outline-none focus:border-[#007acc] transition-colors"
            readOnly
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto py-1">
        <div className="space-y-0.5">
          {files.map((file, index) => (
            <FileNode
              key={`${file.path}-${index}`}
              item={file}
              depth={0}
              onFileClick={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}