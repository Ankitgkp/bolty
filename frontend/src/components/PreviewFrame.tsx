import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PreviewFrameProps {
  files: any[];
  webContainer?: WebContainer;
}

interface ServerReadyEvent {
  port: number;
  url: string;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function main() {
    try {
      console.log('Installing dependencies...');
      const installProcess = await webContainer!.spawn('npm', ['install']);

      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log(data);
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
      const devProcess = await webContainer!.spawn('npm', ['run', 'dev']);

      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log(data);
        }
      }));

      webContainer!.on('server-ready', (port, url) => {
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
                Setting up development environment...
              </p>
            </div>

            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-blue-500 animate-[loading_1.5s_ease-in-out_infinite] rounded-full w-1/2 rounded-full relative overflow-hidden">
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