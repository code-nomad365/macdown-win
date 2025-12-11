import { contextBridge, ipcRenderer } from 'electron'

// 定義暴露給 renderer 的 API
const api = {
  // 檔案操作
  openFile: () => ipcRenderer.invoke('file:open'),
  saveFile: (content: string) => ipcRenderer.invoke('file:save', content),
  saveFileAs: (content: string) => ipcRenderer.invoke('file:saveAs', content),

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
}

// 將 API 暴露到 window 物件
contextBridge.exposeInMainWorld('electronAPI', api)

// TypeScript 型別定義
export type ElectronAPI = typeof api
