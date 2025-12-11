import { ipcMain, dialog } from 'electron'
import { readFile, writeFile } from 'fs/promises'

let currentFilePath: string | null = null

/**
 * 註冊檔案相關的 IPC handlers
 */
export function registerFileHandlers() {
  // 開啟檔案
  ipcMain.handle('file:open', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    const filePath = result.filePaths[0]
    currentFilePath = filePath

    try {
      const content = await readFile(filePath, 'utf-8')
      return {
        content,
        filePath,
      }
    } catch (error) {
      console.error('Failed to read file:', error)
      throw error
    }
  })

  // 儲存檔案（使用當前路徑）
  ipcMain.handle('file:save', async (_event, content: string) => {
    if (!currentFilePath) {
      // 如果沒有當前路徑，執行另存新檔
      return ipcMain.emit('file:saveAs', _event, content)
    }

    try {
      await writeFile(currentFilePath, content, 'utf-8')
      return {
        success: true,
        filePath: currentFilePath,
      }
    } catch (error) {
      console.error('Failed to save file:', error)
      throw error
    }
  })

  // 另存新檔
  ipcMain.handle('file:saveAs', async (_event, content: string) => {
    const result = await dialog.showSaveDialog({
      filters: [
        { name: 'Markdown Files', extensions: ['md'] },
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      defaultPath: 'untitled.md',
    })

    if (result.canceled || !result.filePath) {
      return null
    }

    const filePath = result.filePath
    currentFilePath = filePath

    try {
      await writeFile(filePath, content, 'utf-8')
      return {
        success: true,
        filePath,
      }
    } catch (error) {
      console.error('Failed to save file:', error)
      throw error
    }
  })
}

/**
 * 重置當前檔案路徑（例如建立新檔案時）
 */
export function resetCurrentFilePath() {
  currentFilePath = null
}

/**
 * 取得當前檔案路徑
 */
export function getCurrentFilePath() {
  return currentFilePath
}
