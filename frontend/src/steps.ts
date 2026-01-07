// Core parsing logic for extracting steps from XML(not fully XML that's why using codeFixers.ts) for responses

import { Step, StepType } from './types';
import { fixGeneratedCode } from './utils/codeFixers';

const cache = new Map<string, Step[]>();

export function parseXml(response: string): Step[] {
  if (cache.has(response)) {
    return cache.get(response)!;
  }

  const xmlMatch = response.match(/<boltArtifact[^>]*>([\s\S]*?)(?:<\/boltArtifact>|$)/);

  if (!xmlMatch) {
    return [];
  }

  const xmlContent = xmlMatch[1];
  const steps: Step[] = [];
  let stepId = 1;

  const titleMatch = response.match(/title="([^"]*)"/);
  const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';

  steps.push({
    id: stepId++,
    title: artifactTitle,
    description: '',
    type: StepType.CreateFolder,
    status: 'pending'
  });
  const actionRegex = /<boltAction\s+type=['"]([^'"]*)['"](?:\s+filePath=['"]([^'"]*)['"])?>([\s\S]*?)(?:<\/boltAction>|$)/g;

  let match;
  while ((match = actionRegex.exec(xmlContent)) !== null) {
    const [, type, filePath, content] = match;

    if (type === 'file') {
      // Fix common AI code generation issues (like // comments in JSX)
      const fixedCode = fixGeneratedCode(content.trim(), filePath);
      
      steps.push({
        id: stepId++,
        title: `Create ${filePath || 'file'}`,
        description: '',
        type: StepType.CreateFile,
        status: 'pending',
        code: fixedCode,
        path: filePath
      });
    } else if (type === 'shell') {
      steps.push({
        id: stepId++,
        title: 'Run command',
        description: '',
        type: StepType.RunScript,
        status: 'pending',
        code: content.trim()
      });
    }

    if (!match[0].endsWith('</boltAction>')) {
      break;
    }
  }

  cache.set(response, steps);
  return steps;
}