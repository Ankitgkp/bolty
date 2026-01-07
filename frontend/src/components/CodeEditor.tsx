/**
 * Monaco code editor wrapper with language detection.
 */

import Editor from '@monaco-editor/react';
import { FileItem } from '../types';
import { ChevronRight } from 'lucide-react';

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-[#1e1e1e]">
        <div className="mb-4">
          <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        </div>
        <p className="text-sm font-medium">Select a file to view its contents</p>
      </div>
    );
  }

  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="flex items-center px-4 py-1 bg-[#1e1e1e] text-[#808080] text-[10px] border-b border-[#1e1e1e]">
        <div className="flex items-center gap-1 opacity-70">
          {file.path.split('/').filter(Boolean).map((part, i, arr) => (
            <div key={i} className="flex items-center gap-1">
              <span className={i === arr.length - 1 ? 'text-[#cccccc]' : ''}>{part}</span>
              {i < arr.length - 1 && <ChevronRight className="w-2.5 h-2.5 opacity-40" />}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguage(file.name)}
          theme="vs-dark"
          value={file.content || ''}
          beforeMount={(monaco) => {
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: true,
              noSyntaxValidation: true,
            });
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: true,
              noSyntaxValidation: true,
            });
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
              target: monaco.languages.typescript.ScriptTarget.ESNext,
              allowNonTsExtensions: true,
              moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
              module: monaco.languages.typescript.ModuleKind.ESNext,
              noEmit: true,
              jsx: monaco.languages.typescript.JsxEmit.React,
              allowJs: true,
              checkJs: false,
            });
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
              target: monaco.languages.typescript.ScriptTarget.ESNext,
              allowNonTsExtensions: true,
              moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
              module: monaco.languages.typescript.ModuleKind.ESNext,
              noEmit: true,
              jsx: monaco.languages.typescript.JsxEmit.React,
              allowJs: true,
              checkJs: false,
            });
          }}
          options={{
            readOnly: false,
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            lineNumbers: 'on',
            renderWhitespace: 'none',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
          }}
        />
      </div>
    </div>
  );
}