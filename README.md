# MacDown for Windows 🚀

> 現代化的 Markdown 編輯器，具備即時預覽、語法高亮與 SQLite 文件庫

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-28-blue.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

MacDown for Windows 是受 macOS 經典 Markdown 編輯器 [MacDown](https://macdown.uranusjr.com/) 啟發，專為 Windows 平台打造的現代化 Markdown 編輯器。

## ✨ 功能特色

### 🎨 **雙主題支援**
- 明亮/深色主題一鍵切換
- CodeMirror 6 編輯器主題同步
- Tailwind Typography 精美排版
- 主題偏好自動儲存

### 📝 **強大的編輯體驗**
- **CodeMirror 6** 專業程式碼編輯器
- Markdown 即時語法高亮
- 行號、程式碼折疊、自動完成
- 全文搜尋（Ctrl+F）
- 歷史記錄（Ctrl+Z/Y）

### 🎯 **即時預覽**
- 左右分欄同步預覽
- **markdown-it** 高效渲染引擎
- **Prism.js** 支援 20+ 程式語言語法高亮
- GitHub Flavored Markdown (GFM) 完整支援

### 💾 **檔案管理**
- 開啟/儲存/另存新檔（Ctrl+O/S/Shift+S）
- 未儲存變更警告保護
- 視覺化編輯狀態指示器
- 拖放檔案支援

### 📤 **多格式匯出**
- **HTML 匯出**：GitHub 風格完整樣式（Ctrl+Shift+H）
- **PDF 匯出**：A4 頁面，專業排版（Ctrl+Shift+P）
- 自訂檔案名稱與儲存位置

### 📚 **SQLite 文件庫**
- 本地 SQLite 資料庫儲存
- FTS5 全文搜尋引擎
- 文件 CRUD 完整操作
- 資料夾階層管理
- 標籤系統（多對多關聯）
- 自動維護索引與外鍵約束

### ⌨️ **豐富的鍵盤快捷鍵**
| 功能 | Windows 快捷鍵 |
|------|---------------|
| 開啟檔案 | `Ctrl+O` |
| 儲存檔案 | `Ctrl+S` |
| 另存新檔 | `Ctrl+Shift+S` |
| 匯出 HTML | `Ctrl+Shift+H` |
| 匯出 PDF | `Ctrl+Shift+P` |
| 搜尋 | `Ctrl+F` |
| 復原/重做 | `Ctrl+Z` / `Ctrl+Y` |
| 主題切換 | 點擊標題欄按鈕 |

## 🖼️ 截圖

<!-- TODO: 添加實際截圖 -->
```
深色主題：
┌─────────────────────────────────────────────────────────┐
│ MacDown                            🌙 深色    ● Untitled│
├─────────────────────────────────────────────────────────┤
│                  │                                       │
│  # Markdown      │  Markdown                            │
│  編輯器區域       │  預覽區域                              │
│  (CodeMirror 6)  │  (即時渲染)                           │
│                  │                                       │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ 技術棧

### 前端
- **框架**: React 18 + TypeScript 5.3
- **建構工具**: Vite 5 (HMR + ESBuild)
- **編輯器**: CodeMirror 6
- **樣式**: Tailwind CSS 3 + Typography
- **狀態管理**: Zustand (主題 + 文件庫)

### Markdown 處理
- **渲染引擎**: markdown-it 14
- **語法高亮**: Prism.js (20+ 語言)
- **預覽主題**: Tailwind Typography (prose)

### 後端
- **桌面框架**: Electron 28
- **資料庫**: better-sqlite3
- **檔案系統**: Node.js fs/promises
- **PDF 生成**: Electron printToPDF API

### 開發工具
- **Monorepo**: pnpm workspace
- **程式碼品質**: ESLint + Prettier
- **版本控制**: Git

## 📦 安裝與使用

### 系統需求
- **作業系統**: Windows 10/11
- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0

### 快速開始

#### 1. Clone 專案
```bash
git clone https://github.com/code-nomad365/macdown-win.git
cd macdown-win
```

#### 2. 安裝依賴
```bash
pnpm install
```

#### 3. 編譯專案
```bash
pnpm build
```

#### 4. 啟動應用程式
```bash
pnpm start
```

或使用 **一鍵啟動腳本**：
```bash
start.bat
```

### 開發模式

同時啟動前端開發伺服器與 Electron：

```bash
# 終端機 1：啟動 Vite 開發伺服器
pnpm dev

# 終端機 2：啟動 Electron（自動連接 localhost:5174）
pnpm dev:electron
```

## 📁 專案結構

```
macdown-win/
├── apps/
│   ├── main/                      # Electron 主程序
│   │   ├── src/
│   │   │   ├── database/          # SQLite 資料庫模組
│   │   │   │   ├── db.ts          # 資料庫連接
│   │   │   │   ├── schema.ts      # Schema 定義
│   │   │   │   └── documents.ts   # 文件 CRUD
│   │   │   ├── ipc/               # IPC handlers
│   │   │   │   ├── file-handler.ts
│   │   │   │   ├── export-handler.ts
│   │   │   │   └── library-handler.ts
│   │   │   ├── preload/           # Preload scripts
│   │   │   │   └── index.ts       # contextBridge API
│   │   │   └── index.ts           # 主程序入口
│   │   └── package.json
│   │
│   └── renderer/                  # React 前端
│       ├── src/
│       │   ├── components/        # React 元件
│       │   │   └── CodeMirrorEditor.tsx
│       │   ├── hooks/             # 自訂 Hooks
│       │   │   └── useMarkdown.ts
│       │   ├── stores/            # Zustand stores
│       │   │   └── themeStore.ts
│       │   ├── lib/               # 工具函式庫
│       │   │   └── prism-config.ts
│       │   ├── types/             # TypeScript 類型
│       │   │   └── electron.d.ts
│       │   ├── App.tsx            # 主應用程式元件
│       │   └── main.tsx           # React 入口
│       └── package.json
│
├── packages/
│   └── shared/                    # 共享類型與工具
│       └── src/
│           └── types/
│               └── document.ts    # 文件類型定義
│
├── pnpm-workspace.yaml            # pnpm Monorepo 設定
├── start.bat                      # Windows 一鍵啟動腳本
└── README.md
```

## 🔧 開發指南

### 建構流程

```bash
# 編譯所有套件
pnpm build

# 只編譯主程序
pnpm --filter @macdown/main build

# 只編譯前端
pnpm --filter @macdown/renderer build
```

### 程式碼品質

```bash
# ESLint 檢查
pnpm lint

# TypeScript 類型檢查
pnpm type-check

# 清理所有建構產物
pnpm clean
```

### 新增依賴

```bash
# 為主程序新增依賴
pnpm --filter @macdown/main add <package>

# 為前端新增依賴
pnpm --filter @macdown/renderer add <package>

# 新增共享依賴
pnpm add <package> -w
```

## 🗄️ 資料庫架構

MacDown 使用 SQLite 作為本地文件庫：

### 資料表

#### `documents` - 文件表
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | TEXT | 主鍵（UUID） |
| title | TEXT | 文件標題 |
| content | TEXT | Markdown 內容 |
| folder_id | TEXT | 所屬資料夾 ID（外鍵） |
| created_at | INTEGER | 建立時間戳記 |
| updated_at | INTEGER | 更新時間戳記 |

#### `folders` - 資料夾表
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | TEXT | 主鍵（UUID） |
| name | TEXT | 資料夾名稱 |
| parent_id | TEXT | 父資料夾 ID（外鍵，支援階層） |
| created_at | INTEGER | 建立時間戳記 |

#### `tags` - 標籤表
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | TEXT | 主鍵（UUID） |
| name | TEXT | 標籤名稱（唯一） |
| color | TEXT | 標籤顏色 |
| created_at | INTEGER | 建立時間戳記 |

#### `document_tags` - 文件標籤關聯表
| 欄位 | 類型 | 說明 |
|------|------|------|
| document_id | TEXT | 文件 ID（外鍵） |
| tag_id | TEXT | 標籤 ID（外鍵） |

### 全文搜尋

使用 SQLite FTS5 虛擬表 `documents_fts` 提供高效全文搜尋：
- 索引文件標題與內容
- 觸發器自動同步索引
- 支援中英文混合搜尋

## 🎯 功能路線圖

### v0.1.0 (已完成) ✅
- [x] 基礎 Monorepo 架構
- [x] Electron + React 整合
- [x] CodeMirror 6 編輯器
- [x] markdown-it + Prism.js 渲染
- [x] 檔案開啟/儲存功能
- [x] 主題切換系統
- [x] HTML/PDF 匯出
- [x] SQLite 文件庫後端
- [x] 未儲存變更警告

### v0.2.0 (規劃中) 🚧
- [ ] 文件庫 UI（側邊欄）
- [ ] 資料夾管理介面
- [ ] 標籤系統 UI
- [ ] 進階搜尋介面
- [ ] 文件列表排序/篩選
- [ ] 拖放檔案匯入

### v0.3.0 (未來規劃) 📋
- [ ] 程式碼區塊複製按鈕
- [ ] 圖片拖放貼上
- [ ] 表格編輯器
- [ ] 自訂 CSS 樣式
- [ ] Mermaid 圖表支援
- [ ] 數學公式（KaTeX）

### v1.0.0 (長期目標) 🎯
- [ ] Notion API 同步
- [ ] 雲端備份
- [ ] 多裝置同步
- [ ] Git 整合
- [ ] 外掛系統
- [ ] 自訂快捷鍵

## 🤝 貢獻指南

歡迎提交 Issue 與 Pull Request！

### 提交 PR 前請確認：
1. 程式碼通過 `pnpm lint` 檢查
2. TypeScript 編譯無錯誤 (`pnpm type-check`)
3. 功能測試通過
4. Commit 訊息清晰（建議使用 Conventional Commits）

### Commit 訊息格式：
```
feat: 新增功能
fix: 修復錯誤
docs: 文件更新
style: 程式碼格式調整
refactor: 重構
perf: 效能優化
test: 測試
chore: 建構工具或輔助工具的變動
```

## 📄 授權

本專案採用 [MIT License](LICENSE) 授權。

## 🙏 致謝

- [MacDown](https://macdown.uranusjr.com/) - 靈感來源
- [Electron](https://www.electronjs.org/) - 跨平台桌面框架
- [CodeMirror 6](https://codemirror.net/) - 強大的程式碼編輯器
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown 解析器
- [Prism.js](https://prismjs.com/) - 語法高亮
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

## 📮 聯絡方式

- **GitHub**: [code-nomad365/macdown-win](https://github.com/code-nomad365/macdown-win)
- **Issues**: [提交問題](https://github.com/code-nomad365/macdown-win/issues)

---

**⭐ 如果這個專案對您有幫助，請給我們一個 Star！**

Made with ❤️ using Electron + React + TypeScript
