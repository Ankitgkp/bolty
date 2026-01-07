// landig page with prompt input for project generation

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/layout";
import { HeroSection, PromptInput, GitHubImport } from "../components/home";

export function Home() {
    const [prompt, setPrompt] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            navigate("/builder", { state: { prompt } });
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F0E2] text-[#1A1A1A] flex flex-col font-sans overflow-hidden relative">
            <Navbar />
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 min-h-[80vh]">
                <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-8">
                    <HeroSection />
                    <div className="w-full max-w-2xl mt-8">
                        <PromptInput
                            value={prompt}
                            onChange={setPrompt}
                            onSubmit={handleSubmit}
                        />
                    </div>
                    <GitHubImport />
                </div>
            </main>
        </div>
    );
}
