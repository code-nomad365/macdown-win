# 調試選單功能問題

## 測試步驟

1. **關閉所有正在運行的 MacDown 視窗**

2. **重新啟動應用程式**：
   ```bash
   start.bat
   ```

3. **打開開發者工具**：
   - 在應用程式視窗中按 `F12` 或 `Ctrl+Shift+I`
   - 或從選單: View → Toggle Developer Tools

4. **查看控制台（Console）**：
   - 應該看到以下訊息：
     ```
     ✅ Setting up menu event listeners...
     ✅ Menu event listeners registered successfully
     ```
   - 如果看到 `❌ electronAPI not available`，則說明 preload 腳本有問題

5. **測試選單功能**：
   - 嘗試按 `Ctrl+S` 保存檔案
   - 觀察控制台是否出現：
     ```
     🎯 menu:saveFile event received
     📝 handleSaveFile called, content length: XXX
     💾 Calling electronAPI.saveFile...
     ✅ Save result: {...}
     ```

6. **記錄結果**：
   - 如果看到 `🎯 menu:saveFile event received` → 事件監聽成功
   - 如果看到 `📝 handleSaveFile called` → 處理函數被調用
   - 如果看到 `💾 Calling electronAPI.saveFile` → 開始 IPC 調用
   - 如果看到 `✅ Save result` → IPC 調用成功

## 可能的問題

### 問題 1: 沒有看到任何日誌
**原因**: 應用程式沒有載入新編譯的代碼
**解決**:
- 確保執行了 `start.bat`（會自動重新編譯）
- 或手動執行 `pnpm build` 然後 `pnpm start`

### 問題 2: 看到 `❌ electronAPI not available`
**原因**: Preload 腳本沒有正確載入
**解決**: 檢查 apps/main/dist/preload/index.js 是否存在

### 問題 3: 沒有看到 `🎯 menu:XXX event received`
**原因**: 主進程沒有發送事件
**解決**: 檢查 apps/main/dist/index.js 中的選單配置

### 問題 4: 看到事件但沒有看到 `📝 handleSaveFile called`
**原因**: 處理函數沒有被調用（閉包問題）
**解決**: 這是我們正在調查的問題

## 請將控制台的完整輸出複製到 DEBUG.txt
