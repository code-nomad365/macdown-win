import { getDatabase } from './db.js'
import { Document } from './schema.js'
import { randomUUID } from 'crypto'

/**
 * 建立新文件
 */
export function createDocument(
  title: string,
  content: string,
  folderId: string | null = null
): Document {
  const db = getDatabase()
  const now = Date.now()
  const id = randomUUID()

  const stmt = db.prepare(`
    INSERT INTO documents (id, title, content, folder_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  stmt.run(id, title, content, folderId, now, now)

  return {
    id,
    title,
    content,
    folderId,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * 取得所有文件
 */
export function getAllDocuments(): Document[] {
  const db = getDatabase()

  const stmt = db.prepare(`
    SELECT id, title, content, folder_id as folderId, created_at as createdAt, updated_at as updatedAt
    FROM documents
    ORDER BY updated_at DESC
  `)

  return stmt.all() as Document[]
}

/**
 * 根據 ID 取得文件
 */
export function getDocumentById(id: string): Document | null {
  const db = getDatabase()

  const stmt = db.prepare(`
    SELECT id, title, content, folder_id as folderId, created_at as createdAt, updated_at as updatedAt
    FROM documents
    WHERE id = ?
  `)

  return (stmt.get(id) as Document) || null
}

/**
 * 更新文件
 */
export function updateDocument(
  id: string,
  updates: { title?: string; content?: string; folderId?: string | null }
): Document | null {
  const db = getDatabase()
  const now = Date.now()

  const fields: string[] = []
  const values: any[] = []

  if (updates.title !== undefined) {
    fields.push('title = ?')
    values.push(updates.title)
  }

  if (updates.content !== undefined) {
    fields.push('content = ?')
    values.push(updates.content)
  }

  if (updates.folderId !== undefined) {
    fields.push('folder_id = ?')
    values.push(updates.folderId)
  }

  if (fields.length === 0) {
    return getDocumentById(id)
  }

  fields.push('updated_at = ?')
  values.push(now, id)

  const stmt = db.prepare(`
    UPDATE documents
    SET ${fields.join(', ')}
    WHERE id = ?
  `)

  stmt.run(...values)

  return getDocumentById(id)
}

/**
 * 刪除文件
 */
export function deleteDocument(id: string): boolean {
  const db = getDatabase()

  const stmt = db.prepare('DELETE FROM documents WHERE id = ?')
  const result = stmt.run(id)

  return result.changes > 0
}

/**
 * 搜尋文件（全文搜尋）
 */
export function searchDocuments(query: string): Document[] {
  const db = getDatabase()

  const stmt = db.prepare(`
    SELECT d.id, d.title, d.content, d.folder_id as folderId, d.created_at as createdAt, d.updated_at as updatedAt
    FROM documents d
    INNER JOIN documents_fts ON d.rowid = documents_fts.rowid
    WHERE documents_fts MATCH ?
    ORDER BY rank
  `)

  return stmt.all(query) as Document[]
}

/**
 * 根據資料夾取得文件
 */
export function getDocumentsByFolder(folderId: string | null): Document[] {
  const db = getDatabase()

  const stmt = db.prepare(`
    SELECT id, title, content, folder_id as folderId, created_at as createdAt, updated_at as updatedAt
    FROM documents
    WHERE folder_id ${folderId === null ? 'IS NULL' : '= ?'}
    ORDER BY updated_at DESC
  `)

  return (folderId === null ? stmt.all() : stmt.all(folderId)) as Document[]
}
