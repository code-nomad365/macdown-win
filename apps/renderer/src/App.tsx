import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMarkdown } from './hooks/useMarkdown';
import CodeMirrorEditor, { CodeMirrorEditorRef } from './components/CodeMirrorEditor';
import { useThemeStore } from './stores/themeStore';

const DEFAULT_CONTENT = '# Welcome to MacDown for Windows! 🚀\n\nA modern Markdown editor with **live preview** and **syntax highlighting**.\n\n## ✨ Features\n\n- ✅ Live Markdown preview\n- ✅ Syntax highlighting powered by Prism.js\n- ✅ File management (Ctrl+O / Ctrl+S)\n- ⏳ Multiple themes (coming soon)\n\n## 📝 Markdown Examples\n\n### Text Formatting\n\nYou can write **bold text**, *italic text*, and even ~~strikethrough~~.\n\nInline `code snippets` are also supported!\n\n### Code Blocks\n\n**JavaScript:**\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10)); // 55\n```\n\n**Python:**\n```python\ndef quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)\n```\n\n**TypeScript:**\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nconst user: User = {\n  id: 1,\n  name: "Alice",\n  email: "alice@example.com"\n};\n```\n\n### Keyboard Shortcuts\n\n- **Ctrl+O** - Open file\n- **Ctrl+S** - Save file\n- **Ctrl+Shift+S** - Save as...\n\n---\n\n**Made with ❤️ using Electron + React + TypeScript**';

const App: React.FC = () => {
  const [content, setContent] = useState<string>(DEFAULT_CONTENT);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [savedContent, setSavedContent] = useState<string>(DEFAULT_CONTENT);

  const { theme, toggleTheme } = useThemeStore();
  const editorRef = useRef<CodeMirrorEditorRef>(null);

  const html = useMarkdown(content);

  // 取得檔案名稱（用於標題顯示）
  const fileName = filePath ? filePath.split(/[\\/]/).pop() : 'Untitled';

  // 追蹤內容是否已修改
  useEffect(() => {
    setIsDirty(content !== savedContent);
  }, [content, savedContent]);

  // 檔案操作函數
  const handleOpenFile = useCallback(async () => {
    if (!window.electronAPI) return;

    // 如果有未儲存的變更，先詢問用戶
    if (isDirty) {
      const userChoice = confirm(
        '您有未儲存的變更。是否要繼續開啟新檔案？\n\n點擊「確定」將放棄未儲存的變更。\n點擊「取消」返回繼續編輯。'
      );
      if (!userChoice) return;
    }

    try {
      const result = await window.electronAPI.openFile();
      if (result) {
        setContent(result.content);
        setFilePath(result.filePath);
        setSavedContent(result.content);
        setIsDirty(false);
      }
    } catch (error) {
      console.error('Failed to open file:', error);
      alert('Failed to open file');
    }
  }, [isDirty]);

  const handleSaveFile = useCallback(async () => {
    console.log('📝 handleSaveFile called, content length:', content.length);
    if (!window.electronAPI) {
      console.error('❌ electronAPI not available in handleSaveFile');
      return;
    }

    try {
      console.log('💾 Calling electronAPI.saveFile...');
      const result = await window.electronAPI.saveFile(content);
      console.log('✅ Save result:', result);
      if (result) {
        setFilePath(result.filePath);
        setSavedContent(content);
        setIsDirty(false);
      }
    } catch (error) {
      console.error('Failed to save file:', error);
      alert('Failed to save file');
    }
  }, [content]);

  const handleSaveFileAs = useCallback(async () => {
    if (!window.electronAPI) return;

    try {
      const result = await window.electronAPI.saveFileAs(content);
      if (result) {
        setFilePath(result.filePath);
        setSavedContent(content);
        setIsDirty(false);
      }
    } catch (error) {
      console.error('Failed to save file:', error);
      alert('Failed to save file');
    }
  }, [content]);

  const handleExportHTML = useCallback(async () => {
    if (!window.electronAPI) return;

    try {
      const result = await window.electronAPI.exportHTML(html, fileName || 'Untitled');
      if (result) {
        alert(`HTML 已匯出至：${result.filePath}`);
      }
    } catch (error) {
      console.error('Failed to export HTML:', error);
      alert('Failed to export HTML');
    }
  }, [html, fileName]);

  const handleExportPDF = useCallback(async () => {
    if (!window.electronAPI) return;

    try {
      const result = await window.electronAPI.exportPDF(html, fileName || 'Untitled');
      if (result) {
        alert(`PDF 已匯出至：${result.filePath}`);
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF');
    }
  }, [html, fileName]);

  const handleUndo = useCallback(() => {
    console.log('🔙 handleUndo called');
    if (editorRef.current) {
      editorRef.current.undo();
    }
  }, []);

  const handleRedo = useCallback(() => {
    console.log('🔜 handleRedo called');
    if (editorRef.current) {
      editorRef.current.redo();
    }
  }, []);

  // 監聽選單快捷鍵事件
  useEffect(() => {
    if (!window.electronAPI) {
      console.error('❌ electronAPI not available');
      return;
    }

    console.log('✅ Setting up menu event listeners...');

    const removeOpenListener = window.electronAPI.onOpenFile(() => {
      console.log('🎯 menu:openFile event received');
      handleOpenFile();
    });
    const removeSaveListener = window.electronAPI.onSaveFile(() => {
      console.log('🎯 menu:saveFile event received');
      handleSaveFile();
    });
    const removeSaveAsListener = window.electronAPI.onSaveFileAs(() => {
      console.log('🎯 menu:saveFileAs event received');
      handleSaveFileAs();
    });
    const removeExportHTMLListener = window.electronAPI.onExportHTML(() => {
      console.log('🎯 menu:exportHTML event received');
      handleExportHTML();
    });
    const removeExportPDFListener = window.electronAPI.onExportPDF(() => {
      console.log('🎯 menu:exportPDF event received');
      handleExportPDF();
    });
    const removeUndoListener = window.electronAPI.onUndo(() => {
      console.log('🎯 menu:undo event received');
      handleUndo();
    });
    const removeRedoListener = window.electronAPI.onRedo(() => {
      console.log('🎯 menu:redo event received');
      handleRedo();
    });

    console.log('✅ Menu event listeners registered successfully');

    return () => {
      console.log('🧹 Cleaning up menu event listeners');
      removeOpenListener();
      removeSaveListener();
      removeSaveAsListener();
      removeExportHTMLListener();
      removeExportPDFListener();
      removeUndoListener();
      removeRedoListener();
    };
  }, [handleOpenFile, handleSaveFile, handleSaveFileAs, handleExportHTML, handleExportPDF, handleUndo, handleRedo]);

  // 處理關閉視窗前的警告
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <div className={`flex h-screen w-full flex-col ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
      <header className={`flex h-12 shrink-0 items-center justify-between border-b px-4 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>MacDown</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors ${
              theme === 'dark'
                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={`切換至${theme === 'dark' ? '淺色' : '深色'}主題`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
            <span>{theme === 'dark' ? '淺色' : '深色'}</span>
          </button>
          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {isDirty && <span className="text-orange-500">● </span>}
            {fileName}
          </span>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className={`w-1/2 min-w-0 border-r ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <CodeMirrorEditor ref={editorRef} value={content} onChange={setContent} theme={theme} />
        </div>
        <div className={`w-1/2 min-w-0 overflow-auto p-8 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div
            className={`prose max-w-none break-words ${theme === 'dark' ? 'prose-invert' : 'prose-slate'}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
