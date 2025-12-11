import React, { useState, useEffect } from 'react';
import { useMarkdown } from './hooks/useMarkdown';
import CodeMirrorEditor from './components/CodeMirrorEditor';

const DEFAULT_CONTENT = '# Welcome to MacDown for Windows! 🚀\n\nA modern Markdown editor with **live preview** and **syntax highlighting**.\n\n## ✨ Features\n\n- ✅ Live Markdown preview\n- ✅ Syntax highlighting powered by Prism.js\n- ✅ File management (Ctrl+O / Ctrl+S)\n- ⏳ Multiple themes (coming soon)\n\n## 📝 Markdown Examples\n\n### Text Formatting\n\nYou can write **bold text**, *italic text*, and even ~~strikethrough~~.\n\nInline `code snippets` are also supported!\n\n### Code Blocks\n\n**JavaScript:**\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10)); // 55\n```\n\n**Python:**\n```python\ndef quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)\n```\n\n**TypeScript:**\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nconst user: User = {\n  id: 1,\n  name: "Alice",\n  email: "alice@example.com"\n};\n```\n\n### Keyboard Shortcuts\n\n- **Ctrl+O** - Open file\n- **Ctrl+S** - Save file\n- **Ctrl+Shift+S** - Save as...\n\n---\n\n**Made with ❤️ using Electron + React + TypeScript**';

const App: React.FC = () => {
  const [content, setContent] = useState<string>(DEFAULT_CONTENT);
  const [filePath, setFilePath] = useState<string | null>(null);

  const html = useMarkdown(content);

  // 取得檔案名稱（用於標題顯示）
  const fileName = filePath ? filePath.split(/[\\/]/).pop() : 'Untitled';

  // 檔案操作函數
  const handleOpenFile = async () => {
    if (!window.electronAPI) return;

    try {
      const result = await window.electronAPI.openFile();
      if (result) {
        setContent(result.content);
        setFilePath(result.filePath);
      }
    } catch (error) {
      console.error('Failed to open file:', error);
      alert('Failed to open file');
    }
  };

  const handleSaveFile = async () => {
    if (!window.electronAPI) return;

    try {
      const result = await window.electronAPI.saveFile(content);
      if (result) {
        setFilePath(result.filePath);
      }
    } catch (error) {
      console.error('Failed to save file:', error);
      alert('Failed to save file');
    }
  };

  const handleSaveFileAs = async () => {
    if (!window.electronAPI) return;

    try {
      const result = await window.electronAPI.saveFileAs(content);
      if (result) {
        setFilePath(result.filePath);
      }
    } catch (error) {
      console.error('Failed to save file:', error);
      alert('Failed to save file');
    }
  };

  // 監聽選單快捷鍵事件
  useEffect(() => {
    if (!window.electronAPI) return;

    const removeOpenListener = window.electronAPI.onOpenFile(handleOpenFile);
    const removeSaveListener = window.electronAPI.onSaveFile(handleSaveFile);
    const removeSaveAsListener = window.electronAPI.onSaveFileAs(handleSaveFileAs);

    return () => {
      removeOpenListener();
      removeSaveListener();
      removeSaveAsListener();
    };
  }, [content]);

  return (
    <div className="flex h-screen w-full flex-col bg-white text-slate-900">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <h1 className="text-lg font-bold text-slate-800">MacDown</h1>
        <span className="text-sm text-slate-600">{fileName}</span>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-slate-200">
          <CodeMirrorEditor value={content} onChange={setContent} />
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
