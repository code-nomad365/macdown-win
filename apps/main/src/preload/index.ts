import { contextBridge, ipcRenderer } from 'electron'

// 定義暴露給 renderer 的 API
const api = {
  // 檔案操作
  openFile: () => ipcRenderer.invoke('file:open'),
  openFilePath: (filePath: string) => ipcRenderer.invoke('file:openPath', filePath),
  saveFile: (content: string) => ipcRenderer.invoke('file:save', content),
  saveFileAs: (content: string) => ipcRenderer.invoke('file:saveAs', content),

  // 匯出操作
  exportHTML: (html: string, title: string) => ipcRenderer.invoke('export:html', html, title),
  exportPDF: (html: string, title: string) => ipcRenderer.invoke('export:pdf', html, title),

  // 列印操作
  pageSetup: (html: string, title: string) => ipcRenderer.invoke('print:pageSetup', html, title),
  print: (html: string, title: string) => ipcRenderer.invoke('print:print', html, title),

  // 視圖狀態更新
  updateViewMode: (viewMode: 'both' | 'editor-only' | 'preview-only') =>
    ipcRenderer.send('view:updateMode', viewMode),

  // 視窗關閉控制
  onWindowCloseRequest: (callback: () => void) => {
    ipcRenderer.on('window:close-request', callback)
    return () => ipcRenderer.removeListener('window:close-request', callback)
  },
  confirmWindowClose: () => ipcRenderer.send('window:close-confirmed'),

  // 最近檔案
  addRecentFile: (filePath: string) => ipcRenderer.send('recent:addFile', filePath),
  onOpenRecentFile: (callback: (filePath: string) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, filePath: string) => callback(filePath)
    ipcRenderer.on('menu:openRecentFile', listener)
    return () => ipcRenderer.removeListener('menu:openRecentFile', listener)
  },

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
  onNew: (callback: () => void) => {
    ipcRenderer.on('menu:new', callback)
    return () => ipcRenderer.removeListener('menu:new', callback)
  },
  onClose: (callback: () => void) => {
    ipcRenderer.on('menu:close', callback)
    return () => ipcRenderer.removeListener('menu:close', callback)
  },
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
  onCopyHTML: (callback: () => void) => {
    ipcRenderer.on('menu:copyHTML', callback)
    return () => ipcRenderer.removeListener('menu:copyHTML', callback)
  },
  onSplitRatio: (callback: (ratio: '1:1' | '3:1' | '1:3') => void) => {
    const listener = (_event: Electron.IpcRendererEvent, ratio: '1:1' | '3:1' | '1:3') => callback(ratio)
    ipcRenderer.on('menu:splitRatio', listener)
    return () => ipcRenderer.removeListener('menu:splitRatio', listener)
  },
  onToggleEditor: (callback: () => void) => {
    ipcRenderer.on('menu:toggleEditor', callback)
    return () => ipcRenderer.removeListener('menu:toggleEditor', callback)
  },
  onTogglePreview: (callback: () => void) => {
    ipcRenderer.on('menu:togglePreview', callback)
    return () => ipcRenderer.removeListener('menu:togglePreview', callback)
  },
  onToggleToolbar: (callback: () => void) => {
    ipcRenderer.on('menu:toggleToolbar', callback)
    return () => ipcRenderer.removeListener('menu:toggleToolbar', callback)
  },
  onPageSetup: (callback: () => void) => {
    ipcRenderer.on('menu:pageSetup', callback)
    return () => ipcRenderer.removeListener('menu:pageSetup', callback)
  },
  onPrint: (callback: () => void) => {
    ipcRenderer.on('menu:print', callback)
    return () => ipcRenderer.removeListener('menu:print', callback)
  },
}

// 將 API 暴露到 window 物件
contextBridge.exposeInMainWorld('electronAPI', api)

// TypeScript 型別定義
export type ElectronAPI = typeof api
