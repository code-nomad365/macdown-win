import { ipcMain } from 'electron'
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  searchDocuments,
  getDocumentsByFolder,
} from '../database/documents.js'

/**
 * 註冊文件庫相關的 IPC handlers
 */
export function registerLibraryHandlers() {
  // 建立新文件
  ipcMain.handle('library:createDocument', async (_event, title: string, content: string, folderId?: string | null) => {
    try {
      return createDocument(title, content, folderId || null)
    } catch (error) {
      console.error('Failed to create document:', error)
      throw error
    }
  })

  // 取得所有文件
  ipcMain.handle('library:getAllDocuments', async () => {
    try {
      return getAllDocuments()
    } catch (error) {
      console.error('Failed to get all documents:', error)
      throw error
    }
  })

  // 根據 ID 取得文件
  ipcMain.handle('library:getDocument', async (_event, id: string) => {
    try {
      return getDocumentById(id)
    } catch (error) {
      console.error('Failed to get document:', error)
      throw error
    }
  })

  // 更新文件
  ipcMain.handle('library:updateDocument', async (_event, id: string, updates: { title?: string; content?: string; folderId?: string | null }) => {
    try {
      return updateDocument(id, updates)
    } catch (error) {
      console.error('Failed to update document:', error)
      throw error
    }
  })

  // 刪除文件
  ipcMain.handle('library:deleteDocument', async (_event, id: string) => {
    try {
      return deleteDocument(id)
    } catch (error) {
      console.error('Failed to delete document:', error)
      throw error
    }
  })

  // 搜尋文件
  ipcMain.handle('library:searchDocuments', async (_event, query: string) => {
    try {
      return searchDocuments(query)
    } catch (error) {
      console.error('Failed to search documents:', error)
      throw error
    }
  })

  // 根據資料夾取得文件
  ipcMain.handle('library:getDocumentsByFolder', async (_event, folderId: string | null) => {
    try {
      return getDocumentsByFolder(folderId)
    } catch (error) {
      console.error('Failed to get documents by folder:', error)
      throw error
    }
  })
}
