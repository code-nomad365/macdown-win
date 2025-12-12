/**
 * 資料庫 Schema 定義
 */

export const SCHEMA_VERSION = 1;

/**
 * 建立資料庫 schema 的 SQL 語句
 */
export const CREATE_TABLES = `
-- 文件表
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  folder_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
);

-- 資料夾表
CREATE TABLE IF NOT EXISTS folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- 標籤表
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT,
  created_at INTEGER NOT NULL
);

-- 文件標籤關聯表
CREATE TABLE IF NOT EXISTS document_tags (
  document_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (document_id, tag_id),
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- 建立索引以加速查詢
CREATE INDEX IF NOT EXISTS idx_documents_folder ON documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_documents_updated ON documents(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_folders_parent ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_document_tags_document ON document_tags(document_id);
CREATE INDEX IF NOT EXISTS idx_document_tags_tag ON document_tags(tag_id);

-- 全文搜尋虛擬表
CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
  title,
  content,
  content='documents',
  content_rowid='rowid'
);

-- 觸發器：當文件插入時同步到 FTS
CREATE TRIGGER IF NOT EXISTS documents_ai AFTER INSERT ON documents BEGIN
  INSERT INTO documents_fts(rowid, title, content)
  VALUES (new.rowid, new.title, new.content);
END;

-- 觸發器：當文件更新時同步到 FTS
CREATE TRIGGER IF NOT EXISTS documents_au AFTER UPDATE ON documents BEGIN
  UPDATE documents_fts
  SET title = new.title, content = new.content
  WHERE rowid = old.rowid;
END;

-- 觸發器：當文件刪除時從 FTS 移除
CREATE TRIGGER IF NOT EXISTS documents_ad AFTER DELETE ON documents BEGIN
  DELETE FROM documents_fts WHERE rowid = old.rowid;
END;
`;

/**
 * 文件介面
 */
export interface Document {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: number;
  updatedAt: number;
}

/**
 * 資料夾介面
 */
export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
}

/**
 * 標籤介面
 */
export interface Tag {
  id: string;
  name: string;
  color: string | null;
  createdAt: number;
}
