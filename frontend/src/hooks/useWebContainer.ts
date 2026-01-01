import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

// Global singleton - boot WebContainer immediately on module load
// This saves 1-2s on every navigation since boot happens once at app startup
let webcontainerPromise: Promise<WebContainer> | null = null;

function getWebContainer(): Promise<WebContainer> {
    if (!webcontainerPromise) {
        console.log('[WebContainer] Booting...');
        webcontainerPromise = WebContainer.boot();
        webcontainerPromise.then(() => {
            console.log('[WebContainer] Boot complete');
        });
    }
    return webcontainerPromise;
}

// Start booting immediately when this module is imported
getWebContainer();

export default function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer>();

    useEffect(() => {
        getWebContainer().then(setWebcontainer);
    }, []);

    return webcontainer;
}
