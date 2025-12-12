const RECENT_FILES_KEY = 'macdown-recent-files';
const MAX_RECENT_FILES = 10;

export interface RecentFile {
  path: string;
  name: string;
  lastOpened: number;
}

export function getRecentFiles(): RecentFile[] {
  try {
    const stored = localStorage.getItem(RECENT_FILES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load recent files:', error);
    return [];
  }
}

export function addRecentFile(path: string): void {
  try {
    const recent = getRecentFiles();
    const name = path.split(/[\\/]/).pop() || path;

    // 移除重複的檔案
    const filtered = recent.filter(f => f.path !== path);

    // 加入新檔案到最前面
    const updated: RecentFile[] = [
      { path, name, lastOpened: Date.now() },
      ...filtered
    ].slice(0, MAX_RECENT_FILES);

    localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save recent file:', error);
  }
}

export function clearRecentFiles(): void {
  try {
    localStorage.removeItem(RECENT_FILES_KEY);
  } catch (error) {
    console.error('Failed to clear recent files:', error);
  }
}
