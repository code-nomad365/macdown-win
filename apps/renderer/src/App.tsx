import React, { useState } from 'react';
import { useMarkdown } from './hooks/useMarkdown';

const App: React.FC = () => {
  const [content, setContent] = useState<string>('# Hello MacDown\n\nThis is a **Markdown** editor for Windows.\n\n## Features\n\n- Live preview\n- Syntax highlighting (coming soon)\n- File management (coming soon)\n\n### Try it out!\n\nYou can write:\n\n1. Numbered lists\n2. **Bold** and *italic* text\n3. `code snippets`\n\n```javascript\nfunction hello() {\n  console.log("Hello, MacDown!");\n}\n```\n\n> This is a blockquote\n\n[Links work too!](https://github.com)');

  const html = useMarkdown(content);

  return (
    <div className="flex h-screen w-full flex-col bg-white text-slate-900">
      <header className="flex h-12 shrink-0 items-center border-b border-slate-200 px-4">
        <h1 className="text-lg font-bold text-slate-800">MacDown</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-slate-200">
          <textarea
            className="h-full w-full resize-none p-4 font-mono text-sm outline-none text-slate-800 placeholder:text-slate-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            placeholder="Write your markdown here..."
          />
        </div>
        <div className="flex-1 overflow-auto bg-slate-50 p-8">
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
