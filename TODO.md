# MacDown for Windows - 開發待辦清單

> 最後更新：2025-12-13
> 目前版本：v0.2.0
> 目前階段：Phase 3 完成，Phase 4 部分完成

---

## 📊 專案進度總覽

| 階段 | 狀態 | 完成度 | 備註 |
|------|------|--------|------|
| Phase 0 - 專案初始化 | ✅ 完成 | 100% | Electron + React 架構建立 |
| Phase 1 - MVP 核心功能 | ✅ 完成 | 100% | 編輯器、預覽、檔案操作 |
| Phase 2 - Format 強化 | ✅ 完成 | 100% | Markdown 格式化工具列 |
| Phase 3 - View 與 UI | ✅ 完成 | 100% | 視圖控制、主題、縮放 |
| Phase 4 - 進階功能 | 🔄 進行中 | 60% | 匯出/列印完成，搜尋待開發 |
| Phase 5 - Pro 功能 | ⏳ 待開始 | 0% | 多檔標籤、資料庫等 |

---

## ✅ 已完成功能（v0.2.0）

### Phase 1 - MVP 核心功能
- ✅ 左編輯／右預覽（即時渲染）
- ✅ SplitView 可調整比例（1:1, 3:1, 1:3）
- ✅ File 基礎操作
  - ✅ New (Ctrl+N) - 開啟空白檔案
  - ✅ Open (Ctrl+O) - 開啟檔案
  - ✅ Open Recent - 最近檔案列表（持久化儲存）
  - ✅ Close (Ctrl+W) - 關閉檔案（含未儲存檢查）
  - ✅ Save (Ctrl+S) - 儲存檔案
  - ✅ Save As (Ctrl+Shift+S) - 另存新檔
- ✅ 基本編輯功能（由編輯器原生支援）
  - ✅ Undo (Ctrl+Z) / Redo (Ctrl+Y)
  - ✅ Cut / Copy / Paste
  - ✅ Delete / Select All
- ✅ 視圖控制
  - ✅ Hide/Show Editor (Ctrl+Shift+E)
  - ✅ Hide/Show Preview (Ctrl+Shift+P)
  - ✅ 選單文字動態更新
- ✅ 主題系統
  - ✅ 深色/淺色主題切換
  - ✅ 編輯器與預覽同步主題

### Phase 2 - Format 強化
- ✅ Markdown 格式化工具列（11 個按鈕）
  - ✅ Strong（粗體）(Ctrl+B)
  - ✅ Emphasize（斜體）(Ctrl+I)
  - ✅ Inline Code
  - ✅ Blockquote
  - ✅ Unordered List
  - ✅ Ordered List
  - ✅ Heading (H1-H6)
  - ✅ Link（超連結，自動選中 URL）
  - ✅ Image（圖片，自動選中圖片 URL）
- ✅ Block 操作
  - ✅ Shift Right（縮排）(Tab)
  - ✅ Shift Left（反縮排）(Shift+Tab)
- ✅ Convert To（段落轉換）
  - ✅ Heading (H1-H6)
  - ✅ Ordered List
  - ✅ Unordered List

### Phase 3 - View 與 UI 強化
- ✅ Toggle Toolbar (Ctrl+Shift+T)
  - ✅ 隱藏/顯示編輯器工具列
  - ✅ 提供更大編輯空間
- ✅ Copy Rendered HTML (Ctrl+Shift+C)
  - ✅ 複製 Markdown 渲染後的 HTML
  - ✅ 方便貼到郵件、部落格等
- ✅ 預覽視窗縮放
  - ✅ 縮放範圍：50% ~ 200%
  - ✅ 預設比例：80%
  - ✅ 縮放控制條於預覽區頂部
- ✅ 同步滾動
  - ✅ 編輯器滾動時預覽自動同步
  - ✅ 使用 debounce 優化效能
- ✅ Split View 比例控制
  - ✅ Left 1:1 Right (Ctrl+1)
  - ✅ Left 3:1 Right (Ctrl+2)
  - ✅ Left 1:3 Right (Ctrl+3) - 預設

### Phase 4 - 進階功能（部分完成）
- ✅ 匯出功能
  - ✅ Export HTML (Ctrl+Shift+H)
  - ✅ Export PDF (Ctrl+Shift+P)
  - ✅ 匯出後自動開啟資料夾並選中檔案
  - ✅ 移除 alert 提示，改用開啟資料夾
- ✅ 列印功能
  - ✅ Page Setup - 頁面設定
  - ✅ Print (Ctrl+P) - 列印預覽內容
  - ✅ 支援完整 Markdown 樣式
  - ✅ 在隱藏視窗中渲染後列印
- ✅ 視窗管理改進
  - ✅ 修正右上角 X 按鈕關閉問題
  - ✅ 關閉前檢查未儲存變更

---

## 🎯 待開發功能

### Phase 4 - 進階功能（剩餘項目）

#### 🔍 搜尋與取代（優先）
- ❌ Find (Ctrl+F)
  - 搜尋框 UI
  - 即時高亮搜尋結果
  - 大小寫敏感選項
  - 正規表達式支援
  - 上一個/下一個結果導航
- ❌ Replace (Ctrl+H)
  - 取代單一結果
  - 取代全部
  - 取代預覽
- ❌ Find in Preview
  - 在預覽視窗中搜尋

#### ✍️ 拼字檢查
- ❌ 啟用/停用拼字檢查
- ❌ 自訂字典
- ❌ 拼字建議
- ❌ 語言選擇（英文/中文）

#### 📝 Edit 選單補充
- ❌ Substitutions（符號替換）
  - 智慧引號
  - 智慧破折號
  - 自動替換規則
- ❌ Transformations（大小寫轉換）
  - 全部大寫
  - 全部小寫
  - 首字母大寫
- ❌ Speech（語音朗讀，macOS 特性，可選）

---

### Phase 5 - Pro 版功能（未來計畫）

#### 📂 多檔案管理
- ❌ 多檔標籤（Tabs）
  - 標籤列 UI
  - 標籤切換快捷鍵
  - 拖曳排序
  - 關閉標籤檢查未儲存
- ❌ 工作區（Workspace）
  - 儲存/載入工作區
  - 自動恢復上次開啟的檔案

#### 🗄️ 資料庫與搜尋
- ❌ SQLite 文件庫
  - 文件索引
  - 中繼資料儲存
  - 標籤系統
- ❌ 全文搜尋
  - 跨檔案搜尋
  - 搜尋結果預覽
  - 進階過濾器

#### 🔗 整合功能
- ❌ Notion 同步
  - Notion API 整合
  - 上傳 Markdown 到 Notion
  - 雙向同步（可選）
- ❌ GitHub Gist
  - 發布到 Gist
  - 從 Gist 匯入
- ❌ Dropbox / OneDrive 同步

#### 🎨 進階 UI
- ❌ 自訂主題編輯器
  - 顏色配置
  - 字型選擇
  - 主題匯入/匯出
- ❌ 擴充功能系統
  - Plugin API
  - 第三方插件支援

---

## 🪟 Window 選單（待實作）

### 基礎視窗操作
- ❌ Minimize（最小化）
- ❌ Zoom（放大/還原）
- ❌ Fullscreen（全螢幕）(F11)
- ❌ Center（視窗置中）
- ❌ Bring All to Front（所有視窗移至最上層）

---

## 📘 Help 選單（待實作）

### 基礎說明
- ❌ About（關於）
  - 版本資訊
  - 作者資訊
  - 授權條款
- ❌ Keyboard Shortcuts（快捷鍵列表）
  - 互動式快捷鍵說明
  - 可搜尋快捷鍵
- ❌ Documentation（線上文件）
  - 開啟官方文件網站
- ❌ Report Issue（回報問題）
  - 連結到 GitHub Issues

---

## 🐛 已知問題與改進

### 待修正
- ❌ 無已知重大 Bug

### 體驗優化
- ❌ 新增更多鍵盤快捷鍵
- ❌ 改善錯誤訊息提示
- ❌ 加入使用者偏好設定面板
- ❌ 記憶視窗位置與大小
- ❌ 自動儲存草稿

---

## 📋 技術債務

### 程式碼品質
- ❌ 增加單元測試覆蓋率
- ❌ E2E 測試（使用 Playwright）
- ❌ 效能優化
  - Markdown 渲染效能
  - 大檔案編輯效能
- ❌ 程式碼重構
  - 統一錯誤處理機制
  - 改善 IPC 通訊架構

### 文件完善
- ❌ API 文件
- ❌ 開發者指南
- ❌ 貢獻指南
- ❌ 架構設計文件

---

## 🚀 下一步行動

### 短期目標（v0.3.0）
1. **完成 Phase 4** - 搜尋與取代功能
2. **完成 Phase 4** - 拼字檢查
3. **完成 Window 選單** - 視窗管理功能
4. **完成 Help 選單** - 說明與關於

### 中期目標（v0.5.0）
1. 偏好設定面板
2. 自訂主題編輯器
3. 效能優化
4. 測試覆蓋率提升

### 長期目標（v1.0.0）
1. 多檔標籤支援
2. 資料庫與全文搜尋
3. Notion / GitHub 整合
4. 擴充功能系統

---

## 📝 備註

- 本清單根據 MacDown 原版功能整理
- 優先順序可根據使用者回饋調整
- Phase 5 功能為進階擴充，非必要項目
- 所有快捷鍵遵循 Windows 慣例（Ctrl 取代 Cmd）

---

**Last Updated**: 2025-12-13
**Project**: [MacDown for Windows](https://github.com/code-nomad365/macdown-win)
**Current Version**: v0.2.0
