import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

// Helper function to strip ANSI escape codes
function stripAnsi(str: string): string {
  return str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '');
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function main() {
    try {
      console.log('Installing dependencies...');
      const installProcess = await webContainer.spawn('npm', ['install']);

      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          const cleanData = stripAnsi(data);
          if (cleanData.trim()) {
            console.log(cleanData);
          }
        }
      }));

      // Wait for installation to complete
      const installExitCode = await installProcess.exit;

      if (installExitCode !== 0) {
        console.error('Installation failed with exit code:', installExitCode);
        setIsLoading(false);
        return;
      }

      console.log('Starting dev server...');
      const devProcess = await webContainer.spawn('npm', ['run', 'dev']);

      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          const cleanData = stripAnsi(data);
          if (cleanData.trim()) {
            console.log(cleanData);
          }
        }
      }));

      // Wait for `server-ready` event
      webContainer.on('server-ready', (port, url) => {
        console.log('Server ready on port:', port);
        console.log('Server URL:', url);
        setUrl(url);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error setting up preview:', error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (webContainer) {
      main();
    }
  }, [webContainer]);

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {isLoading && !url && (
        <div className="text-center">
          <p className="mb-2">Loading preview...</p>
          <p className="text-sm">Installing dependencies and starting dev server</p>
        </div>
      )}
      {!isLoading && !url && (
        <div className="text-center">
          <p className="mb-2 text-red-400">Failed to start preview</p>
          <p className="text-sm">Check console for errors</p>
        </div>
      )}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}