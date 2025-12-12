# MacDown for Windows - 變更日誌

## 最新更新

### Phase 3 - View 與 UI 強化 (2025-12-12)
- ✅ **Toggle Toolbar（切換工具列）**
  - 新增 View > Toggle Toolbar 選單選項
  - 快捷鍵：Ctrl+Shift+T
  - 可隱藏/顯示編輯器工具列，提供更大的編輯空間
  - 適合專注寫作時使用
- ✅ **Copy Rendered HTML（複製渲染後的 HTML）**
  - 新增 Edit > Copy Rendered HTML 選單選項
  - 快捷鍵：Ctrl+Shift+C
  - 一鍵複製 Markdown 渲染後的 HTML 內容到剪貼簿
  - 方便將內容貼到其他支援 HTML 的地方

## 歷史更新

### UI 改進 (2025-12-12)
- ✅ 移除右上角最近檔案按鈕，簡化標題列 UI
- ✅ File 選單新增 Open Recent 子選單
- ✅ File 選單新增 Page Setup 和 Print 功能
- ✅ 所有選單項目統一使用英文，保持一致性

### 匯出功能改進 (2025-12-12)
- ✅ HTML/PDF 匯出後自動開啟資料夾並選中檔案
- ✅ 移除匯出成功的 alert 提示，改用直接開啟資料夾作為反饋
- ✅ 保留錯誤提示，匯出失敗時顯示清楚的錯誤訊息

### 預覽視窗縮放 (2025-12-12)
- ✅ 新增預覽視窗縮放控制（50% ~ 200%）
- ✅ 預設縮放比例設為 80%（最適合觀看）
- ✅ 縮放控制條位於預覽區域頂部

### 視窗關閉改進 (2025-12-12)
- ✅ 修正視窗右上角 X 按鈕無法關閉問題
- ✅ 關閉視窗前檢查未儲存的變更
- ✅ 提供儲存選項後再關閉

### Phase 2 - 格式強化功能 (2025-12-12)
- ✅ Block 操作：縮排/反縮排
- ✅ Convert To：標題、有序列表、無序列表
- ✅ 超連結插入（自動選中 URL）
- ✅ 圖片插入（自動選中圖片 URL）
- ✅ 工具列新增 11 個按鈕並分組顯示

### View 選單改進 (2025-12-12)
- ✅ 動態顯示 Hide/Show Editor 和 Hide/Show Preview
- ✅ 選單文字會根據當前狀態即時更新
- ✅ 渲染進程與主進程同步視圖狀態

### Bug 修正 (2025-12-12)
- ✅ File/New 現在開啟空白檔案而非歡迎訊息
- ✅ 修正 TypeScript 編譯錯誤（未使用變數）
- ✅ 修正視窗關閉按鈕失效問題

### Bug 修正與改進 (2025-12-12)
- ✅ Open Recent 現在會動態顯示最近開啟的檔案
- ✅ 檔案開啟後會自動加入最近檔案列表
- ✅ 修正開發環境 port 不一致問題（5173 vs 5174）
- ✅ 改進 Page Setup 和 Print 功能：
  - **Page Setup**：直接開啟列印對話框，讓使用者可以設定頁面選項（紙張大小、方向、邊距等）
  - **Print**：正確列印 Markdown 預覽內容（而非整個應用程式視窗）
  - 在隱藏視窗中渲染 HTML 後進行列印
  - 支援完整的 Markdown 樣式（標題、程式碼、表格等）
  - 修正「此應用程式不支援預覽列印」錯誤
  - Page Setup 和 Print 現在功能一致，都可以進行頁面設定和列印
- ✅ UI 改進：
  - 預設分割比例改為 Left 1:3 Right（編輯器較小，預覽較大）
  - 更適合查看 Markdown 預覽效果
  - **新增同步滾動功能**：滾動左側編輯器時，右側預覽視窗會自動同步滾動
  - 使用 debounce 優化滾動效能

## 功能狀態

### ✅ Phase 1 - MVP 功能（已完成）
- 編輯器 + 預覽即時渲染
- SplitView 三種比例（1:1, 3:1, 1:3）
- File 基礎操作（New, Open, Save, Save As, Close）
- Open Recent 最近檔案功能
- 基本編輯（Undo, Redo, Cut, Copy, Paste）
- Hide Preview / Hide Editor
- 深色/淺色主題切換

### ✅ Phase 2 - Format 強化（已完成）
- Markdown 語法按鈕（粗體、斜體、程式碼、引用、列表、標題、連結、圖片）
- Block 操作（縮排/反縮排）
- Convert To（標題、有序列表、無序列表）

### ✅ Phase 3 - View 與 UI 強化（已完成）
- Toggle Toolbar（隱藏/顯示工具列）
- Copy Rendered HTML（複製渲染後的 HTML）
- 主題切換（Editor + Preview）
- 同步滾動功能
- 預覽視窗縮放控制

### ✅ Phase 4 - 進階功能（部分完成）
- ✅ HTML / PDF 匯出
- ✅ Page Setup 頁面設定
- ✅ Print 列印功能
- ❌ 搜尋＋取代（待實作）
- ❌ 拼字檢查（待實作）

### 📋 待開發
- 搜尋與取代
- 拼字檢查
- 多檔標籤
- 全文搜尋
- Notion 整合
