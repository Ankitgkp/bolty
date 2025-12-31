import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StepsList } from "../components/StepsList";
import { FileExplorer } from "../components/FileExplorer";
import { TabView } from "../components/TabView";
import { CodeEditor } from "../components/CodeEditor";
import { PreviewFrame } from "../components/PreviewFrame";
import { Step, FileItem, StepType } from "../types";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { parseXml } from "../steps";
import useWebContainer from "../hooks/useWebContainer";
import { Loader } from "../components/Loader";


export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!prompt) {
      navigate('/');
    }
  }, [prompt, navigate]);

  useEffect(() => {
    console.log("Builder useEffect: steps=", steps.length, "files=", files.length);
    let updateHappened = false;
    const pendingSteps = steps.filter(({ status }) => status === "pending");
    console.log("Pending steps:", pendingSteps.length);

    if (pendingSteps.length > 0) {
      updateHappened = true;
      let newFiles = [...files];

      pendingSteps.forEach((step) => {
        console.log("Processing step:", step.type, step.path);
        // Relaxed check for path presence
        if (step?.type === StepType.CreateFile && step.path) {
          const pathParts = step.path.split("/").filter(p => p !== "");
          console.log("Path parts:", pathParts);

          const updateFileStructure = (nodes: FileItem[], parts: string[]): FileItem[] => {
            if (parts.length === 0) return nodes;

            const [currentPart, ...remainingParts] = parts;
            // Actually, calculating path correctly:
            const isLastPart = remainingParts.length === 0;

            const existingNodeIndex = nodes.findIndex(node => node.name === currentPart);

            if (existingNodeIndex !== -1) {
              const existingNode = nodes[existingNodeIndex];
              if (isLastPart) {
                // Update file content
                const updatedNodes = [...nodes];
                updatedNodes[existingNodeIndex] = { ...existingNode, content: step.code };
                return updatedNodes;
              } else {
                // Recursively update folder
                const updatedNodes = [...nodes];
                updatedNodes[existingNodeIndex] = {
                  ...existingNode,
                  children: updateFileStructure(existingNode.children || [], remainingParts)
                };
                return updatedNodes;
              }
            } else {
              // Create new node
              if (isLastPart) {
                return [...nodes, {
                  name: currentPart,
                  type: "file",
                  path: `/${pathParts.join('/')}`,
                  content: step.code
                }];
              } else {
                const newFolder: FileItem = {
                  name: currentPart,
                  type: "folder",
                  path: `/${pathParts.slice(0, pathParts.indexOf(currentPart) + 1).join('/')}`,
                  children: []
                };
                newFolder.children = updateFileStructure([], remainingParts);
                return [...nodes, newFolder];
              }
            }
          };

          newFiles = updateFileStructure(newFiles, pathParts);
        }
      });
      console.log("Setting new files, count:", newFiles.length);

      setFiles(newFiles);
      setSteps((s) => s.map(step => ({ ...step, status: "completed" as "completed" })));

      // Update selectedFile if it's the one being modified
      if (selectedFile) {
        const findFile = (nodes: FileItem[], path: string): FileItem | null => {
          for (const node of nodes) {
            if (node.path === path) return node;
            if (node.children) {
              const found = findFile(node.children, path);
              if (found) return found;
            }
          }
          return null;
        };

        const updatedSelectedFile = findFile(newFiles, selectedFile.path);
        if (updatedSelectedFile && updatedSelectedFile.content !== selectedFile.content) {
          setSelectedFile(updatedSelectedFile);
        }
      }
    }
  }, [steps, files, selectedFile]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === "folder") {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children
              ? Object.fromEntries(
                file.children.map((child) => [
                  child.name,
                  processFile(child, false),
                ])
              )
              : {},
          };
        } else if (file.type === "file") {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || "",
              },
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || "",
              },
            };
          }
        }

        return mountStructure[file.name];
      };

      // Process each top-level file/folder
      files.forEach((file) => processFile(file, true));

      return mountStructure;
    };

    const mountStructure = createMountStructure(files);

    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    try {
      const templateResponse = await axios.post(`${BACKEND_URL}/template`, {
        prompt: prompt.trim(),
      });
      setTemplateSet(true);

      const { prompts, uiPrompts } = templateResponse.data;

      setSteps(
        parseXml(uiPrompts[0]).map((x: Step) => ({
          ...x,
          status: "pending",
        }))
      );

      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...prompts.map((content: string) => ({
              role: "user",
              content,
            })),
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;

        const newSteps = parseXml(fullResponse).map((x) => ({
          ...x,
          status: "pending" as "pending",
        }));

        setSteps((s) => {
          // Simple merge: replace old parsed steps with new ones
          // but preserve already completed status if any (though here they start as pending)
          const baseSteps = s.filter(step => !newSteps.some(ns => ns.path === step.path && ns.type === step.type));
          return [...baseSteps, ...newSteps];
        });
      }

      setLoading(false);

      setLlmMessages(
        [...prompts, prompt].map((content) => ({
          role: "user",
          content,
        }))
      );

      setLlmMessages((x) => [
        ...x,
        { role: "assistant", content: fullResponse },
      ]);
    } catch (error) {
      console.error("Error during initialization:", error);
      alert("Failed to generate content. Please try again.");
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      <header className="bg-[#1e1e1e] border-b border-[#333] px-6 py-3 flex flex-shrink-0 items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <span className="text-blue-400">bolt</span>
            <span className="opacity-50 text-sm font-normal">/</span>
            <span className="text-sm font-normal text-gray-400 truncate max-w-[300px]">{prompt}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <TabView activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex items-center gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-md font-medium transition-colors">
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-6 gap-0">
          {/* Left Sidebar: Steps */}
          <div className="col-span-2 border-r border-[#333] bg-[#1a1a1a] flex flex-col min-h-0">
            <div className="flex-1 overflow-auto p-4">
              <StepsList
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
              {(loading || !templateSet) && <div className="mt-4"><Loader /></div>}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#333] bg-[#1e1e1e] flex-shrink-0">
              <div className="relative">
                <textarea
                  value={userPrompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask bolt to help you today..."
                  className="w-full bg-[#252526] border border-[#3c3c3c] text-sm text-gray-200 p-3 rounded-lg outline-none focus:border-blue-500 transition-all resize-none h-24"
                ></textarea>
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    disabled={loading || !userPrompt.trim()}
                    onClick={async () => {
                      const newMessage = {
                        role: "user" as "user",
                        content: userPrompt,
                      };

                      setLoading(true);
                      const response = await fetch(`${BACKEND_URL}/chat`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          messages: [...llmMessages, newMessage],
                        }),
                      });

                      if (!response.body) return;
                      const reader = response.body.getReader();
                      const decoder = new TextDecoder();
                      let fullResponse = "";

                      setLlmMessages((x) => [...x, newMessage]);

                      while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value);
                        fullResponse += chunk;

                        const newSteps = parseXml(fullResponse).map((x) => ({
                          ...x,
                          status: "pending" as "pending",
                        }));

                        setSteps((s) => {
                          const baseSteps = s.filter(step => !newSteps.some(ns => ns.path === step.path && ns.type === step.type));
                          return [...baseSteps, ...newSteps];
                        });
                      }

                      setLlmMessages((x) => [
                        ...x,
                        {
                          role: "assistant",
                          content: fullResponse,
                        },
                      ]);

                      setLoading(false);
                      setPrompt("");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-1.5 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Area: Explorer + Editor/Preview */}
          <div className="col-span-4 flex flex-col bg-[#1e1e1e] min-h-0">
            <div className="flex-1 flex overflow-hidden">
              {activeTab === "code" ? (
                <>
                  <div className="w-64 flex-shrink-0 border-r border-[#333]">
                    <FileExplorer
                      files={files}
                      onFileSelect={setSelectedFile}
                      selectedFile={selectedFile}
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <CodeEditor file={selectedFile} />
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-auto">
                  <PreviewFrame webContainer={webcontainer} files={files} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
