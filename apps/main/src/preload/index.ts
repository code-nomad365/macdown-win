import { contextBridge, ipcRenderer } from 'electron'

// 定義暴露給 renderer 的 API
const api = {
  // 檔案操作
  openFile: () => ipcRenderer.invoke('file:open'),
  saveFile: (content: string) => ipcRenderer.invoke('file:save', content),
  saveFileAs: (content: string) => ipcRenderer.invoke('file:saveAs', content),

  // 匯出操作
  exportHTML: (html: string, title: string) => ipcRenderer.invoke('export:html', html, title),
  exportPDF: (html: string, title: string) => ipcRenderer.invoke('export:pdf', html, title),

  // 文件庫操作
  createDocument: (title: string, content: string, folderId?: string | null) =>
    ipcRenderer.invoke('library:createDocument', title, content, folderId),
  getAllDocuments: () => ipcRenderer.invoke('library:getAllDocuments'),
  getDocument: (id: string) => ipcRenderer.invoke('library:getDocument', id),
  updateDocument: (id: string, updates: { title?: string; content?: string; folderId?: string | null }) =>
    ipcRenderer.invoke('library:updateDocument', id, updates),
  deleteDocument: (id: string) => ipcRenderer.invoke('library:deleteDocument', id),
  searchDocuments: (query: string) => ipcRenderer.invoke('library:searchDocuments', query),
  getDocumentsByFolder: (folderId: string | null) => ipcRenderer.invoke('library:getDocumentsByFolder', folderId),

  // 監聽快捷鍵事件
  onOpenFile: (callback: () => void) => {
    ipcRenderer.on('menu:openFile', callback)
    return () => ipcRenderer.removeListener('menu:openFile', callback)
  },
  onSaveFile: (callback: () => void) => {
    ipcRenderer.on('menu:saveFile', callback)
    return () => ipcRenderer.removeListener('menu:saveFile', callback)
  },
  onSaveFileAs: (callback: () => void) => {
    ipcRenderer.on('menu:saveFileAs', callback)
    return () => ipcRenderer.removeListener('menu:saveFileAs', callback)
  },
  onExportHTML: (callback: () => void) => {
    ipcRenderer.on('menu:exportHTML', callback)
    return () => ipcRenderer.removeListener('menu:exportHTML', callback)
  },
  onExportPDF: (callback: () => void) => {
    ipcRenderer.on('menu:exportPDF', callback)
    return () => ipcRenderer.removeListener('menu:exportPDF', callback)
  },
  onUndo: (callback: () => void) => {
    ipcRenderer.on('menu:undo', callback)
    return () => ipcRenderer.removeListener('menu:undo', callback)
  },
  onRedo: (callback: () => void) => {
    ipcRenderer.on('menu:redo', callback)
    return () => ipcRenderer.removeListener('menu:redo', callback)
  },
}

// 將 API 暴露到 window 物件
contextBridge.exposeInMainWorld('electronAPI', api)

// TypeScript 型別定義
export type ElectronAPI = typeof api
