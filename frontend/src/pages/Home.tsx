// landig page with prompt input for project generation

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/layout";
import { PromptInput, GitHubImport } from "../components/home";
import { BackgroundLines } from "../components/ui/background-lines";
import { Sparkles, Users, Wand2 } from "lucide-react";

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
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-hidden bg-noise">
      <BackgroundLines className="absolute inset-0 z-0" svgOptions={{ duration: 8 }}>
      <div className="absolute inset-0" />
      </BackgroundLines>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/4 w-[800px] h-[600px] bg-gradient-radial from-gray-800/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold opacity-85 italic text-white tracking-tight">
            What you want to build?
            </h1>
          
          <p className="text-gray-400 text-m">
            Type your prompt below and press the button to start the journey.
          </p>

          <div className="w-full max-w-2xl mt-4">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <FeatureCard
              icon={<Sparkles className="w-4 h-4" />}
              title="Think"
              description="Solve the hardest problems in math, science, and coding with our reasoning model."
            />
            <FeatureCard
              icon={<Users className="w-4 h-4" />}
              title="Create Avatar"
              description="Dive deep to deliver insightful results with Boman's fast and innovative avatar generator."
            />
            <FeatureCard
              icon={<Wand2 className="w-4 h-4" />}
              title="Edit Image"
              description="Transform your images with style transfers, edits, and more."
            />
          </div>

          <GitHubImport />
        </div>
      </main>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 text-left hover:border-gray-700 transition-colors cursor-pointer">
      <div className="inline-flex items-center gap-2 bg-[#2a2a2a] text-gray-300 text-sm px-3 py-1.5 rounded-full mb-3">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
