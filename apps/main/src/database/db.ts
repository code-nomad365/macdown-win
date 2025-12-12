import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { CREATE_TABLES } from './schema.js'

let db: Database.Database | null = null

/**
 * 取得使用者資料目錄
 */
function getUserDataPath(): string {
  const userDataPath = app.getPath('userData')
  const dbDir = join(userDataPath, 'database')

  // 確保目錄存在
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }

  return join(dbDir, 'macdown.db')
}

/**
 * 初始化資料庫
 */
export function initDatabase(): Database.Database {
  if (db) {
    return db
  }

  const dbPath = getUserDataPath()
  console.log('Database path:', dbPath)

  db = new Database(dbPath)

  // 啟用外鍵約束
  db.pragma('foreign_keys = ON')

  // 建立表格
  db.exec(CREATE_TABLES)

  console.log('Database initialized successfully')

  return db
}

/**
 * 取得資料庫實例
 */
export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.')
  }
  return db
}

/**
 * 關閉資料庫連接
 */
export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
    console.log('Database closed')
  }
}
