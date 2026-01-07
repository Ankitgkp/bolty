// (Parsing logic for RAW generated code coming straight from the AI)

// Removes all comments from code to prevent JSX parsing issues
export function removeComments(code: string): string {
  let result = '';
  let i = 0;
  let inString = false;
  let stringChar = '';
  let inTemplateString = false;
  let inMultiLineComment = false;
  let inSingleLineComment = false;

  while (i < code.length) {
    const char = code[i];
    const nextChar = code[i + 1] || '';
    const prevChar = code[i - 1] || '';

    // Handle end of single-line comment
    if (inSingleLineComment) {
      if (char === '\n') {
        inSingleLineComment = false;
        result += char;
      }
      i++;
      continue;
    }

    // Handle multi-line comment
    if (inMultiLineComment) {
      if (char === '*' && nextChar === '/') {
        inMultiLineComment = false;
        i += 2;
        continue;
      }
      if (char === '\n') {
        result += char;
      }
      i++;
      continue;
    }

    // Handle string literals
    if (!inString && !inTemplateString && (char === '"' || char === "'") && prevChar !== '\\') {
      inString = true;
      stringChar = char;
      result += char;
      i++;
      continue;
    }

    if (inString && char === stringChar && prevChar !== '\\') {
      inString = false;
      stringChar = '';
      result += char;
      i++;
      continue;
    }

    if (inString) {
      result += char;
      i++;
      continue;
    }

    // Handle template strings
    if (!inTemplateString && char === '`') {
      inTemplateString = true;
      result += char;
      i++;
      continue;
    }

    if (inTemplateString && char === '`' && prevChar !== '\\') {
      inTemplateString = false;
      result += char;
      i++;
      continue;
    }

    if (inTemplateString) {
      result += char;
      i++;
      continue;
    }

    // Detect single-line comment
    if (char === '/' && nextChar === '/') {
      inSingleLineComment = true;
      i += 2;
      continue;
    }

    // Detect multi-line comment (keep JSX comments)
    if (char === '/' && nextChar === '*') {
      const beforeSlash = result.slice(-1);
      if (beforeSlash === '{') {
        result += char;
        i++;
        continue;
      }
      inMultiLineComment = true;
      i += 2;
      continue;
    }

    result += char;
    i++;
  }

  return result
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

// Fix common JSX issues that cause "unreachable code" errors
export function fixJsxIssues(code: string): string {
  let fixed = code;
  
  // Remove any stray semicolons after JSX closing tags that might appear
  // Pattern: </tag>; should be </tag>
  fixed = fixed.replace(/(<\/[a-zA-Z][a-zA-Z0-9]*>)\s*;(?=\s*<)/g, '$1');
  
  // Remove semicolons before closing parenthesis in return statements
  // Pattern: </tag>;) should be </tag>)
  fixed = fixed.replace(/(<\/[a-zA-Z][a-zA-Z0-9]*>)\s*;\s*\)/g, '$1\n  )');
  
  // Fix cases where there's a semicolon after closing tag before another tag
  fixed = fixed.replace(/(<\/[a-zA-Z][a-zA-Z0-9]*>);(\s*<[a-zA-Z])/g, '$1$2');
  
  return fixed;
}

// Applies all code fixes
export function fixGeneratedCode(code: string, filePath?: string): string {
  let fixed = code;
  
  // Remove comments
  fixed = removeComments(fixed);
  
  // Fix JSX issues for JSX/TSX files
  if (!filePath || filePath.match(/\.(jsx|tsx)$/i)) {
    fixed = fixJsxIssues(fixed);
  }
  
  return fixed;
}
