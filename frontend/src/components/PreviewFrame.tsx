/**
 * WebContainer preview frame for live app preview.
 */

import { WebContainer } from '@webcontainer/api';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface PreviewFrameProps {
  files: any[];
  webContainer?: WebContainer;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; 
  }
  return hash.toString(36);
}

function findFileByName(files: any[], name: string): any | null {
  for (const file of files) {
    if (file.name === name && file.type === 'file') {
      return file;
    }
    if (file.children) {
      const found = findFileByName(file.children, name);
      if (found) return found;
    }
  }
  return null;
}

let globalDevServerRunning = false;
let globalServerUrl = '';
let globalServerListenerAdded = false;
let globalInstalledPackageHash: string | null = null;

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState(globalServerUrl);
  const [isLoading, setIsLoading] = useState(!globalServerUrl);
  const [status, setStatus] = useState(globalServerUrl ? "Ready" : "Initializing...");
  const initializingRef = useRef(false);

  const getPackageJsonHash = useCallback((files: any[]): string | null => {
    const pkgFile = findFileByName(files, 'package.json');
    return pkgFile?.content ? simpleHash(pkgFile.content) : null;
  }, []);

  async function main() {
    if (initializingRef.current) {
      console.log('[Preview] Already initializing, skipping...');
      return;
    }

    if (globalDevServerRunning && globalServerUrl) {
      console.log('[Preview] Dev server already running, using existing URL');
      setUrl(globalServerUrl);
      setIsLoading(false);
      setStatus("Ready (HMR active)");
      return;
    }

    try {
      initializingRef.current = true;

      const currentPackageHash = getPackageJsonHash(files);
      const needsInstall = currentPackageHash !== globalInstalledPackageHash;

      console.log('[Preview] Package hash:', currentPackageHash);
      console.log('[Preview] Previous hash:', globalInstalledPackageHash);
      console.log('[Preview] Needs install:', needsInstall);

      if (needsInstall) {
        setStatus("Installing dependencies...");
        console.log('[Preview] Installing dependencies...');
        const installProcess = await webContainer!.spawn('npm', ['install']);

        installProcess.output.pipeTo(new WritableStream({
          write(data) {
            console.log(data);
          }
        }));

        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          console.error('[Preview] Installation failed with exit code:', installExitCode);
          setStatus("Installation failed");
          setIsLoading(false);
          initializingRef.current = false;
          return;
        }

        console.log('[Preview] Dependencies installed successfully');
        globalInstalledPackageHash = currentPackageHash;
      } else {
        console.log('[Preview] Skipping npm install - dependencies unchanged');
        setStatus("Dependencies up to date");
      }

      if (!globalServerListenerAdded) {
        webContainer!.on('server-ready', (port, serverUrl) => {
          console.log('[Preview] Server ready on port:', port);
          console.log('[Preview] Server URL:', serverUrl);
          globalServerUrl = serverUrl;
          globalDevServerRunning = true;
          setUrl(serverUrl);
          setIsLoading(false);
          setStatus("Ready");
        });
        globalServerListenerAdded = true;
      }

      if (!globalDevServerRunning) {
        setStatus("Starting dev server...");
        console.log('[Preview] Starting dev server...');
        
        const devProcess = await webContainer!.spawn('npm', ['run', 'dev']);

        devProcess.output.pipeTo(new WritableStream({
          write(data) {
            console.log(data);
          }
        }));

      } else {
        console.log('[Preview] Dev server already running - HMR will handle updates');
        setUrl(globalServerUrl);
        setIsLoading(false);
        setStatus("Ready (HMR active)");
      }
    } catch (error) {
      console.error('[Preview] Error setting up preview:', error);
      setStatus("Error occurred");
      setIsLoading(false);
    } finally {
      initializingRef.current = false;
    }
  }

  useEffect(() => {
    if (webContainer && files.length > 0) {
      main();
    }
  }, [webContainer]);

  useEffect(() => {
    async function checkAndInstallDeps() {
      if (!webContainer || files.length === 0) return;
      
      const currentPackageHash = getPackageJsonHash(files);
      
      if (currentPackageHash && currentPackageHash !== globalInstalledPackageHash) {
        console.log('[Preview] Package.json changed, reinstalling dependencies...');
        setStatus("Installing new dependencies...");
        setIsLoading(true);
        
        try {
          const installProcess = await webContainer.spawn('npm', ['install']);
          
          installProcess.output.pipeTo(new WritableStream({
            write(data) {
              console.log(data);
            }
          }));
          
          const exitCode = await installProcess.exit;
          
          if (exitCode === 0) {
            console.log('[Preview] New dependencies installed successfully');
            globalInstalledPackageHash = currentPackageHash;
            setStatus("Ready (HMR active)");
          } else {
            console.error('[Preview] Failed to install new dependencies');
            setStatus("Installation failed");
          }
        } catch (error) {
          console.error('[Preview] Error installing dependencies:', error);
        }
        
        setIsLoading(false);
      }
    }
    
    if (globalDevServerRunning) {
      checkAndInstallDeps();
    }
  }, [files, webContainer, getPackageJsonHash]);

  useEffect(() => {
    if (globalServerUrl && !url) {
      setUrl(globalServerUrl);
      setIsLoading(false);
    }
  }, [files]);

  return (
    <div className="h-full flex items-center justify-center bg-[#1e1e1e]">
      {isLoading && !url && (
        <div className="text-center w-full max-w-sm px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
            </div>

            <div className="w-full space-y-2">
              <h3 className="text-lg font-medium text-gray-200">
                Initializing Preview
              </h3>
              <p className="text-sm text-gray-400">
                {status}
              </p>
            </div>

            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-blue-500 animate-[loading_1.5s_ease-in-out_infinite] rounded-full w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shimmer_1s_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isLoading && !url && (
        <div className="text-center">
          <p className="mb-2 text-red-400">Failed to start preview</p>
          <p className="text-sm text-gray-400">Check console for errors</p>
        </div>
      )}
      {url && <iframe title="preview" width={"100%"} height={"100%"} src={url} className="border-none" />}
    </div>
  );
}