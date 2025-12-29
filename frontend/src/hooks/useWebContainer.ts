import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';
import { debounce } from 'lodash';

export default function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer>();

    const initializeWebContainer = debounce(async () => {
        if (!webcontainer) {
            const webcontainerInstance = await WebContainer.boot();
            setWebcontainer(webcontainerInstance);
        }
    }, 300); // Debounce to prevent frequent calls

    useEffect(() => {
        initializeWebContainer();
    }, []);

    return webcontainer;
}
