import React, { useState } from 'react';
import { useMarkdown } from './hooks/useMarkdown';

const App: React.FC = () => {
  const [content, setContent] = useState<string>('# Welcome to MacDown for Windows! 🚀\n\nA modern Markdown editor with **live preview** and **syntax highlighting**.\n\n## ✨ Features\n\n- ✅ Live Markdown preview\n- ✅ Syntax highlighting powered by Prism.js\n- ⏳ File management (coming soon)\n- ⏳ Multiple themes (coming soon)\n\n## 📝 Markdown Examples\n\n### Text Formatting\n\nYou can write **bold text**, *italic text*, and even ~~strikethrough~~.\n\nInline `code snippets` are also supported!\n\n### Code Blocks\n\n**JavaScript:**\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10)); // 55\n```\n\n**Python:**\n```python\ndef quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)\n```\n\n**TypeScript:**\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nconst user: User = {\n  id: 1,\n  name: "Alice",\n  email: "alice@example.com"\n};\n```\n\n### Lists\n\n**Unordered:**\n- React\n- Vue\n- Angular\n\n**Ordered:**\n1. Install dependencies\n2. Run development server\n3. Build for production\n\n### Blockquotes\n\n> "The best way to predict the future is to invent it."\n> — Alan Kay\n\n### Links & Images\n\n[Visit GitHub](https://github.com) | [Learn Markdown](https://www.markdownguide.org/)\n\n---\n\n**Made with ❤️ using Electron + React + TypeScript**');

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
