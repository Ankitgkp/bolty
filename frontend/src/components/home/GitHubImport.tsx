// import with github (STILL IN DEVELOPMENT) you can ts-ignore it :)

import { Github } from 'lucide-react';

export function GitHubImport() {
    return (
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-6">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors text-gray-500">
                <Github className="w-4 h-4" />
                Import from GitHub
            </button>
        </div>
    );
}
