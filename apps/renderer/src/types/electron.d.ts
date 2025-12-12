import { Document } from '@macdown/shared/types/document'

// Electron API 型別定義
export interface ElectronAPI {
  // 檔案操作
  openFile: () => Promise<{ content: string; filePath: string } | null>
  saveFile: (content: string) => Promise<{ success: boolean; filePath: string } | null>
  saveFileAs: (content: string) => Promise<{ success: boolean; filePath: string } | null>

  // 匯出操作
  exportHTML: (html: string, title: string) => Promise<{ success: boolean; filePath: string } | null>
  exportPDF: (html: string, title: string) => Promise<{ success: boolean; filePath: string } | null>

  // 文件庫操作
  createDocument: (title: string, content: string, folderId?: string | null) => Promise<Document>
  getAllDocuments: () => Promise<Document[]>
  getDocument: (id: string) => Promise<Document | null>
  updateDocument: (id: string, updates: { title?: string; content?: string; folderId?: string | null }) => Promise<Document | null>
  deleteDocument: (id: string) => Promise<boolean>
  searchDocuments: (query: string) => Promise<Document[]>
  getDocumentsByFolder: (folderId: string | null) => Promise<Document[]>

  // 事件監聽
  onOpenFile: (callback: () => void) => () => void
  onSaveFile: (callback: () => void) => () => void
  onSaveFileAs: (callback: () => void) => () => void
  onExportHTML: (callback: () => void) => () => void
  onExportPDF: (callback: () => void) => () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
