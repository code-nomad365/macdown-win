import { app } from 'electron'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const RECENT_FILES_PATH = join(app.getPath('userData'), 'recent-files.json')
const MAX_RECENT_FILES = 10

export interface RecentFile {
  path: string
  name: string
  lastOpened: number
}

export async function getRecentFiles(): Promise<RecentFile[]> {
  try {
    if (!existsSync(RECENT_FILES_PATH)) {
      return []
    }
    const data = await readFile(RECENT_FILES_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Failed to load recent files:', error)
    return []
  }
}

export async function addRecentFile(path: string): Promise<void> {
  try {
    // 確保 userData 目錄存在
    const userDataDir = app.getPath('userData')
    if (!existsSync(userDataDir)) {
      await mkdir(userDataDir, { recursive: true })
    }

    const recent = await getRecentFiles()
    const name = path.split(/[\\/]/).pop() || path

    // 移除重複的檔案
    const filtered = recent.filter(f => f.path !== path)

    // 加入新檔案到最前面
    const updated: RecentFile[] = [
      { path, name, lastOpened: Date.now() },
      ...filtered
    ].slice(0, MAX_RECENT_FILES)

    await writeFile(RECENT_FILES_PATH, JSON.stringify(updated, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to save recent file:', error)
  }
}

export async function clearRecentFiles(): Promise<void> {
  try {
    await writeFile(RECENT_FILES_PATH, JSON.stringify([]), 'utf-8')
  } catch (error) {
    console.error('Failed to clear recent files:', error)
  }
}
