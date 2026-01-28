// init web container 

import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

let webcontainerPromise: Promise<WebContainer> | null = null;

function getWebContainer(): Promise<WebContainer> {
    if (!webcontainerPromise) {
        webcontainerPromise = WebContainer.boot();
    }
    return webcontainerPromise;
}

// getWebContainer();

export default function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer>();

    useEffect(() => {
        getWebContainer().then(setWebcontainer);
    }, []);

    return webcontainer;
}