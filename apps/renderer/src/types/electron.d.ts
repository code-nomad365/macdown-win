// Electron API 型別定義
export interface ElectronAPI {
  openFile: () => Promise<{ content: string; filePath: string } | null>
  saveFile: (content: string) => Promise<{ success: boolean; filePath: string } | null>
  saveFileAs: (content: string) => Promise<{ success: boolean; filePath: string } | null>
  onOpenFile: (callback: () => void) => () => void
  onSaveFile: (callback: () => void) => () => void
  onSaveFileAs: (callback: () => void) => () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
