import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMarkdown } from './hooks/useMarkdown';
import CodeMirrorEditor, { CodeMirrorEditorRef } from './components/CodeMirrorEditor';
import Toolbar from './components/Toolbar';
import ZoomControl from './components/ZoomControl';
import { useThemeStore } from './stores/themeStore';

const DEFAULT_CONTENT = '# Welcome to MacDown for Windows! 🚀\n\nA modern Markdown editor with **live preview** and **syntax highlighting**.\n\n## ✨ Features\n\n- ✅ Live Markdown preview\n- ✅ Syntax highlighting powered by Prism.js\n- ✅ File management (Ctrl+O / Ctrl+S)\n- ⏳ Multiple themes (coming soon)\n\n## 📝 Markdown Examples\n\n### Text Formatting\n\nYou can write **bold text**, *italic text*, and even ~~strikethrough~~.\n\nInline `code snippets` are also supported!\n\n### Code Blocks\n\n**JavaScript:**\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10)); // 55\n```\n\n**Python:**\n```python\ndef quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)\n```\n\n**TypeScript:**\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nconst user: User = {\n  id: 1,\n  name: "Alice",\n  email: "alice@example.com"\n};\n```\n\n### Keyboard Shortcuts\n\n- **Ctrl+O** - Open file\n- **Ctrl+S** - Save file\n- **Ctrl+Shift+S** - Save as...\n\n---\n\n**Made with ❤️ using Electron + React + TypeScript**';

// 空白檔案內容
const EMPTY_CONTENT = '';

const App: React.FC = () => {
  const [content, setContent] = useState<string>(DEFAULT_CONTENT);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [savedContent, setSavedContent] = useState<string>(DEFAULT_CONTENT);
  const [splitRatio, setSplitRatio] = useState<'1:1' | '3:1' | '1:3'>('1:3');
  const [viewMode, setViewMode] = useState<'both' | 'editor-only' | 'preview-only'>('both');
  const [previewZoom, setPreviewZoom] = useState<number>(80);
  const [showToolbar, setShowToolbar] = useState<boolean>(true);

  const { theme, toggleTheme } = useThemeStore();
  const editorRef = useRef<CodeMirrorEditorRef>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const html = useMarkdown(content);

  // 取得檔案名稱（用於標題顯示）
  const fileName = filePath ? filePath.split(/[\\/]/).pop() : 'Untitled';

  // 追蹤內容是否已修改
  useEffect(() => {
    setIsDirty(content !== savedContent);
  }, [content, savedContent]);

  // 當 viewMode 改變時，通知主進程更新選單
  useEffect(() => {
    if (window.electronAPI?.updateViewMode) {
      window.electronAPI.updateViewMode(viewMode);
    }
  }, [viewMode]);

  // 檔案操作函數
  const handleNew = useCallback(() => {
    // 如果有未儲存的變更，先詢問用戶
    if (isDirty) {
      const userChoice = confirm(
        '您有未儲存的變更。是否要繼續新增文件？\n\n點擊「確定」將放棄未儲存的變更。\n點擊「取消」返回繼續編輯。'
      );
      if (!userChoice) return;
    }

    // 重設為空白內容
    setContent(EMPTY_CONTENT);
    setFilePath(null);
    setSavedContent(EMPTY_CONTENT);
    setIsDirty(false);
  }, [isDirty]);

  const handleClose = useCallback(async () => {
    // 如果有未儲存的變更，詢問用戶
    if (isDirty) {
      const userChoice = confirm(
        '您有未儲存的變更。是否要儲存後關閉？\n\n點擊「確定」儲存並關閉。\n點擊「取消」放棄變更並關閉。'
      );

      if (userChoice && window.electronAPI) {
        // 用戶選擇儲存
        try {
          await window.electronAPI.saveFile(content);
        } catch (error) {
          console.error('Failed to save file before closing:', error);
        }
      }
    }

    // 關閉文件，重設為空白狀態
    setContent(EMPTY_CONTENT);
    setFilePath(null);
    setSavedContent(EMPTY_CONTENT);
    setIsDirty(false);
  }, [isDirty, content]);

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
        // 添加到最近檔案
        window.electronAPI.addRecentFile(result.filePath);
      }
    } catch (error) {
      console.error('Failed to open file:', error);
      alert('Failed to open file');
    }
  }, [isDirty]);

  const handleOpenRecentFile = useCallback(async (path: string) => {
    if (!window.electronAPI) return;

    // 如果有未儲存的變更，先詢問用戶
    if (isDirty) {
      const userChoice = confirm(
        '您有未儲存的變更。是否要繼續開啟新檔案？\n\n點擊「確定」將放棄未儲存的變更。\n點擊「取消」返回繼續編輯。'
      );
      if (!userChoice) return;
    }

    try {
      const result = await window.electronAPI.openFilePath(path);
      if (result) {
        setContent(result.content);
        setFilePath(result.filePath);
        setSavedContent(result.content);
        setIsDirty(false);
        // 添加到最近檔案
        window.electronAPI.addRecentFile(result.filePath);
      }
    } catch (error) {
      console.error('Failed to open recent file:', error);
      alert('無法開啟檔案');
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
      await window.electronAPI.exportHTML(html, fileName || 'Untitled');
      // 匯出成功後會自動開啟資料夾，不需要顯示 alert
    } catch (error) {
      console.error('Failed to export HTML:', error);
      alert('匯出 HTML 失敗');
    }
  }, [html, fileName]);

  const handleExportPDF = useCallback(async () => {
    if (!window.electronAPI) return;

    try {
      await window.electronAPI.exportPDF(html, fileName || 'Untitled');
      // 匯出成功後會自動開啟資料夾，不需要顯示 alert
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('匯出 PDF 失敗');
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

  // 處理分割比例變更
  const handleSplitRatio = useCallback((ratio: '1:1' | '3:1' | '1:3') => {
    console.log('📐 Split ratio changed to:', ratio);
    setSplitRatio(ratio);
  }, []);

  // 處理視圖模式切換
  const handleToggleEditor = useCallback(() => {
    console.log('👁️ Toggle editor visibility');
    setViewMode(prev => {
      // 如果編輯器可見（both 或 editor-only），則隱藏編輯器
      if (prev === 'both' || prev === 'editor-only') {
        return 'preview-only';
      }
      // 如果編輯器不可見（preview-only），則顯示編輯器
      return 'both';
    });
  }, []);

  const handleTogglePreview = useCallback(() => {
    console.log('👁️ Toggle preview visibility');
    setViewMode(prev => {
      // 如果預覽可見（both 或 preview-only），則隱藏預覽
      if (prev === 'both' || prev === 'preview-only') {
        return 'editor-only';
      }
      // 如果預覽不可見（editor-only），則顯示預覽
      return 'both';
    });
  }, []);

  const handleToggleToolbar = useCallback(() => {
    console.log('🔧 Toggle toolbar visibility');
    setShowToolbar(prev => !prev);
  }, []);

  // 複製渲染後的 HTML
  const handleCopyHTML = useCallback(() => {
    console.log('📋 Copy rendered HTML');
    if (navigator.clipboard && html) {
      navigator.clipboard.writeText(html)
        .then(() => {
          console.log('✅ HTML copied to clipboard');
          // 可以選擇性地顯示一個提示
        })
        .catch((error) => {
          console.error('Failed to copy HTML:', error);
          alert('複製 HTML 失敗');
        });
    }
  }, [html]);

  // 工具列格式化處理函式
  const handleBold = useCallback(() => {
    editorRef.current?.insertBold();
  }, []);

  const handleItalic = useCallback(() => {
    editorRef.current?.insertItalic();
  }, []);

  const handleCode = useCallback(() => {
    editorRef.current?.insertCode();
  }, []);

  const handleQuote = useCallback(() => {
    editorRef.current?.insertQuote();
  }, []);

  const handleList = useCallback(() => {
    editorRef.current?.insertList();
  }, []);

  const handleOrderedList = useCallback(() => {
    editorRef.current?.insertOrderedList();
  }, []);

  const handleHeading = useCallback(() => {
    editorRef.current?.insertHeading();
  }, []);

  const handleLink = useCallback(() => {
    editorRef.current?.insertLink();
  }, []);

  const handleImage = useCallback(() => {
    editorRef.current?.insertImage();
  }, []);

  const handleIndent = useCallback(() => {
    editorRef.current?.indentLines();
  }, []);

  const handleOutdent = useCallback(() => {
    editorRef.current?.outdentLines();
  }, []);

  // 預覽縮放控制
  const handleZoomIn = useCallback(() => {
    setPreviewZoom(prev => Math.min(prev + 10, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setPreviewZoom(prev => Math.max(prev - 10, 50));
  }, []);

  const handleZoomReset = useCallback(() => {
    setPreviewZoom(80);
  }, []);

  // 處理編輯器滾動，同步預覽視窗
  const handleEditorScroll = useCallback((scrollPercentage: number) => {
    if (previewRef.current) {
      const scrollHeight = previewRef.current.scrollHeight - previewRef.current.clientHeight;
      const targetScrollTop = scrollHeight * scrollPercentage;
      previewRef.current.scrollTop = targetScrollTop;
    }
  }, []);

  // 頁面設定和列印
  const handlePageSetup = useCallback(async () => {
    console.log('📄 Page Setup');
    if (!window.electronAPI) return;

    try {
      const result = await window.electronAPI.pageSetup(html, fileName || 'Untitled');
      if (!result.success && result.error) {
        console.error('Page setup failed:', result.error);
        alert('無法開啟頁面設定');
      }
    } catch (error) {
      console.error('Failed to open page setup:', error);
      alert('無法開啟頁面設定');
    }
  }, [html, fileName]);

  const handlePrint = useCallback(async () => {
    console.log('🖨️ Print');
    if (!window.electronAPI) return;

    try {
      const result = await window.electronAPI.print(html, fileName || 'Untitled');
      if (!result.success && result.error) {
        console.error('Print failed:', result.error);
        alert('列印失敗');
      }
    } catch (error) {
      console.error('Failed to print:', error);
      alert('列印失敗');
    }
  }, [html, fileName]);

  // 監聽選單快捷鍵事件
  useEffect(() => {
    if (!window.electronAPI) {
      console.error('❌ electronAPI not available');
      return;
    }

    console.log('✅ Setting up menu event listeners...');

    const removeNewListener = window.electronAPI.onNew(() => {
      console.log('🎯 menu:new event received');
      handleNew();
    });
    const removeCloseListener = window.electronAPI.onClose(() => {
      console.log('🎯 menu:close event received');
      handleClose();
    });
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
    const removeSplitRatioListener = window.electronAPI.onSplitRatio((ratio) => {
      console.log('🎯 menu:splitRatio event received:', ratio);
      handleSplitRatio(ratio);
    });
    const removeToggleEditorListener = window.electronAPI.onToggleEditor(() => {
      console.log('🎯 menu:toggleEditor event received');
      handleToggleEditor();
    });
    const removeTogglePreviewListener = window.electronAPI.onTogglePreview(() => {
      console.log('🎯 menu:togglePreview event received');
      handleTogglePreview();
    });
    const removePageSetupListener = window.electronAPI.onPageSetup(() => {
      console.log('🎯 menu:pageSetup event received');
      handlePageSetup();
    });
    const removePrintListener = window.electronAPI.onPrint(() => {
      console.log('🎯 menu:print event received');
      handlePrint();
    });
    const removeOpenRecentListener = window.electronAPI.onOpenRecentFile((filePath) => {
      console.log('🎯 menu:openRecentFile event received:', filePath);
      handleOpenRecentFile(filePath);
    });
    const removeToggleToolbarListener = window.electronAPI.onToggleToolbar(() => {
      console.log('🎯 menu:toggleToolbar event received');
      handleToggleToolbar();
    });
    const removeCopyHTMLListener = window.electronAPI.onCopyHTML(() => {
      console.log('🎯 menu:copyHTML event received');
      handleCopyHTML();
    });

    console.log('✅ Menu event listeners registered successfully');

    return () => {
      console.log('🧹 Cleaning up menu event listeners');
      removeNewListener();
      removeCloseListener();
      removeOpenListener();
      removeSaveListener();
      removeSaveAsListener();
      removeExportHTMLListener();
      removeExportPDFListener();
      removeUndoListener();
      removeRedoListener();
      removeSplitRatioListener();
      removeToggleEditorListener();
      removeTogglePreviewListener();
      removePageSetupListener();
      removePrintListener();
      removeOpenRecentListener();
      removeToggleToolbarListener();
      removeCopyHTMLListener();
    };
  }, [handleNew, handleClose, handleOpenFile, handleSaveFile, handleSaveFileAs, handleExportHTML, handleExportPDF, handleUndo, handleRedo, handleSplitRatio, handleToggleEditor, handleTogglePreview, handlePageSetup, handlePrint, handleOpenRecentFile, handleToggleToolbar, handleCopyHTML]);

  // 處理視窗關閉請求
  useEffect(() => {
    if (!window.electronAPI) return;

    const removeCloseRequestListener = window.electronAPI.onWindowCloseRequest(() => {
      console.log('🎯 Window close requested');

      // 如果有未儲存的變更，詢問用戶
      if (isDirty) {
        const userChoice = confirm(
          '您有未儲存的變更。是否要儲存後關閉？\n\n點擊「確定」儲存並關閉。\n點擊「取消」放棄變更並關閉。'
        );

        if (userChoice) {
          // 用戶選擇儲存
          window.electronAPI.saveFile(content).then(() => {
            window.electronAPI.confirmWindowClose();
          }).catch((error) => {
            console.error('Failed to save file before closing:', error);
            // 即使儲存失敗，仍然允許關閉
            window.electronAPI.confirmWindowClose();
          });
        } else {
          // 用戶選擇不儲存，直接關閉
          window.electronAPI.confirmWindowClose();
        }
      } else {
        // 沒有未儲存的變更，直接關閉
        window.electronAPI.confirmWindowClose();
      }
    });

    return () => {
      removeCloseRequestListener();
    };
  }, [isDirty, content]);

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
        {viewMode !== 'preview-only' && (
          <div className={`min-w-0 flex flex-col ${viewMode === 'editor-only' ? 'w-full' : `border-r ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} ${
            splitRatio === '1:1' ? 'w-1/2' : splitRatio === '3:1' ? 'w-3/4' : 'w-1/4'
          }`}`}>
            {showToolbar && (
              <Toolbar
                onBold={handleBold}
                onItalic={handleItalic}
                onCode={handleCode}
                onQuote={handleQuote}
                onList={handleList}
                onOrderedList={handleOrderedList}
                onHeading={handleHeading}
                onLink={handleLink}
                onImage={handleImage}
                onIndent={handleIndent}
                onOutdent={handleOutdent}
                theme={theme}
              />
            )}
            <div className="flex-1 overflow-hidden">
              <CodeMirrorEditor
                ref={editorRef}
                value={content}
                onChange={setContent}
                theme={theme}
                onScroll={handleEditorScroll}
              />
            </div>
          </div>
        )}
        {viewMode !== 'editor-only' && (
          <div className={`min-w-0 flex flex-col ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'} ${
            viewMode === 'preview-only' ? 'w-full' : (splitRatio === '1:1' ? 'w-1/2' : splitRatio === '3:1' ? 'w-1/4' : 'w-3/4')
          }`}>
            <ZoomControl
              zoom={previewZoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomReset={handleZoomReset}
              theme={theme}
            />
            <div ref={previewRef} className="flex-1 overflow-auto p-8">
              <div
                className={`prose max-w-none break-words ${theme === 'dark' ? 'prose-invert' : 'prose-slate'}`}
                style={{
                  transform: `scale(${previewZoom / 100})`,
                  transformOrigin: 'top left',
                  width: `${10000 / previewZoom}%`,
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
