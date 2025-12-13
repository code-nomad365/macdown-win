import { Document } from '@macdown/shared/types/document'

// Electron API 型別定義
export interface ElectronAPI {
  // 檔案操作
  openFile: () => Promise<{ content: string; filePath: string } | null>
  openFilePath: (filePath: string) => Promise<{ content: string; filePath: string } | null>
  saveFile: (content: string) => Promise<{ success: boolean; filePath: string } | null>
  saveFileAs: (content: string) => Promise<{ success: boolean; filePath: string } | null>
  showInFolder: (filePath: string) => Promise<{ success: boolean; error?: string }>

  // 匯出操作
  exportHTML: (html: string, title: string) => Promise<{ success: boolean; filePath: string } | null>
  exportPDF: (html: string, title: string) => Promise<{ success: boolean; filePath: string } | null>

  // 列印操作
  pageSetup: (html: string, title: string) => Promise<{ success: boolean; error?: string }>
  print: (html: string, title: string) => Promise<{ success: boolean; error?: string }>

  // 視圖狀態更新
  updateViewMode: (viewMode: 'both' | 'editor-only' | 'preview-only') => void

  // 視窗關閉控制
  onWindowCloseRequest: (callback: () => void) => () => void
  confirmWindowClose: () => void

  // 最近檔案
  addRecentFile: (filePath: string) => void
  onOpenRecentFile: (callback: (filePath: string) => void) => () => void

  // 文件庫操作
  createDocument: (title: string, content: string, folderId?: string | null) => Promise<Document>
  getAllDocuments: () => Promise<Document[]>
  getDocument: (id: string) => Promise<Document | null>
  updateDocument: (id: string, updates: { title?: string; content?: string; folderId?: string | null }) => Promise<Document | null>
  deleteDocument: (id: string) => Promise<boolean>
  searchDocuments: (query: string) => Promise<Document[]>
  getDocumentsByFolder: (folderId: string | null) => Promise<Document[]>

  // 事件監聽
  onNew: (callback: () => void) => () => void
  onClose: (callback: () => void) => () => void
  onOpenFile: (callback: () => void) => () => void
  onSaveFile: (callback: () => void) => () => void
  onSaveFileAs: (callback: () => void) => () => void
  onExportHTML: (callback: () => void) => () => void
  onExportPDF: (callback: () => void) => () => void
  onUndo: (callback: () => void) => () => void
  onRedo: (callback: () => void) => () => void
  onCopyHTML: (callback: () => void) => () => void
  onSplitRatio: (callback: (ratio: '1:1' | '3:1' | '1:3') => void) => () => void
  onToggleEditor: (callback: () => void) => () => void
  onTogglePreview: (callback: () => void) => () => void
  onToggleToolbar: (callback: () => void) => () => void
  onPageSetup: (callback: () => void) => () => void
  onPrint: (callback: () => void) => () => void
  onFind: (callback: () => void) => () => void
  onSetTheme: (callback: (theme: string) => void) => () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
