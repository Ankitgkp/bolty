// main ide interface for code generation and preview means landing page for code and preview

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Step } from "../types";
import { 
    useWebContainer, 
    useFileManager, 
    useWebContainerMount, 
    useLLMChat, 
    useBuilderInit 
} from "../hooks";
import { BuilderHeader } from "../components/layout";
import { TabView } from "../components/TabView";
import { StepsList } from "../components/StepsList";
import { Loader } from "../components/Loader";
import { 
    ChatInput, 
    SidebarPanel, 
    SidebarContent, 
    MainPanel, 
    CodePanel, 
    PreviewPanel 
} from "../components/builder";

export function Builder() {
    const location = useLocation();
    const navigate = useNavigate();
    const { prompt } = location.state as { prompt: string };
    
    const [userPrompt, setUserPrompt] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
    const [steps, setSteps] = useState<Step[]>([]);

    const webcontainer = useWebContainer();
    const { files, selectedFile, setSelectedFile } = useFileManager(steps, setSteps);
    const { loading, sendMessage, initializeChat } = useLLMChat(setSteps);
    const { templateSet } = useBuilderInit({ prompt, setSteps, initializeChat });

    useWebContainerMount(files, webcontainer);

    useEffect(() => {
        if (!prompt) {
            navigate("/");
        }
    }, [prompt, navigate]);

    async function handleChatSubmit() {
        await sendMessage(userPrompt);
        setUserPrompt("");
    }

    return (
        <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
            <BuilderHeader title="bolt" subtitle={prompt}>
                <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            </BuilderHeader>

            <div className="flex-1 overflow-hidden">
                <div className="h-full grid grid-cols-6 gap-0">
                    <SidebarPanel>
                        <SidebarContent>
                            <StepsList
                                steps={steps}
                                currentStep={currentStep}
                                onStepClick={setCurrentStep}
                            />
                            {(loading || !templateSet) && (
                                <div className="mt-4">
                                    <Loader />
                                </div>
                            )}
                        </SidebarContent>
                        <ChatInput
                            value={userPrompt}
                            onChange={setUserPrompt}
                            disabled={loading}
                            onSubmit={handleChatSubmit}
                        />
                    </SidebarPanel>

                    <MainPanel>
                        {activeTab === "code" ? (
                            <CodePanel
                                files={files}
                                selectedFile={selectedFile}
                                onFileSelect={setSelectedFile}
                            />
                        ) : (
                            <PreviewPanel webContainer={webcontainer} files={files} />
                        )}
                    </MainPanel>
                </div>
            </div>
        </div>
    );
}
