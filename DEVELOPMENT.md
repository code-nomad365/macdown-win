# MacDown for Windows - 開發指南

## 專案架構

MacDown for Windows 是一個使用 Electron + React + TypeScript 打造的現代 Markdown 編輯器。

```
macdown-win/
├── apps/
│   ├── main/          # Electron 主程序
│   └── renderer/      # React 前端
├── packages/
│   └── shared/        # 共用型別定義
├── config/            # 配置檔案
└── scripts/           # 建置腳本
```

## 技術棧

- **Electron 28** - 桌面應用程式框架
- **React 18** - 前端 UI 框架
- **TypeScript 5** - 型別安全
- **Vite 5** - 快速建置工具
- **Tailwind CSS 3** - 實用優先 CSS 框架
- **pnpm** - 快速、節省空間的套件管理器

## 開發環境設定

### 必要條件

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安裝依賴

```bash
pnpm install
```

## 開發模式

### 方式一：手動啟動（推薦用於開發）

1. **終端 1** - 啟動 Vite 開發伺服器：
   ```bash
   pnpm dev
   ```

2. **終端 2** - 啟動 Electron：
   ```bash
   pnpm start
   ```

### 方式二：一鍵啟動

```bash
pnpm build && pnpm start
```

## 建置指令

### 編譯所有套件

```bash
pnpm build
```

### 僅編譯 Electron 主程序

```bash
pnpm --filter @macdown/main build
```

### 僅編譯 React 前端

```bash
pnpm --filter @macdown/renderer build
```

## 程式碼品質

### Linting

```bash
pnpm lint
```

### 型別檢查

```bash
pnpm type-check
```

## 專案狀態

**當前版本：v0.1.0 MVP**

### ✅ 已完成

- [x] Monorepo 專案結構
- [x] TypeScript + ESLint + Prettier 配置
- [x] Electron 主程序骨架
- [x] React + Vite 前端骨架
- [x] 雙欄式編輯器 UI（編輯器 + 預覽）
- [x] 基本型別定義
- [x] Tailwind CSS 樣式系統

### 🚧 進行中

- [ ] Markdown 渲染引擎整合（markdown-it）
- [ ] 語法高亮（Prism.js）
- [ ] 檔案開啟/儲存功能
- [ ] 主題系統

### 📋 規劃中

- [ ] 偏好設定
- [ ] 快捷鍵系統
- [ ] SQLite 文件庫
- [ ] 全文搜尋
- [ ] Notion 同步

## Git 工作流程

專案使用 conventional commits 規範：

- `feat`: 新功能
- `fix`: 錯誤修復
- `chore`: 專案維護
- `docs`: 文件更新
- `refactor`: 程式碼重構

## 疑難排解

### Electron 無法啟動

確保已經編譯 TypeScript：

```bash
pnpm --filter @macdown/main build
```

### Vite 開發伺服器錯誤

清除快取並重新安裝：

```bash
pnpm clean
pnpm install
```

## 授權

MIT License
