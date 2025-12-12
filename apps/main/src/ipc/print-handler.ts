import { ipcMain, BrowserWindow } from 'electron'

/**
 * 註冊列印相關的 IPC handlers
 */
export function registerPrintHandlers() {
  // Page Setup - 打開列印對話框（頁面設定在現代系統中已整合到列印對話框）
  ipcMain.handle('print:pageSetup', async (_event, html: string, title: string) => {
    try {
      // 建立一個隱藏視窗來渲染要列印的內容
      const printWin = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
        },
      })

      const fullHtml = generatePrintHTML(html, title)
      await printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(fullHtml)}`)

      // 開啟列印對話框（用戶可以在此設定頁面選項）
      await printWin.webContents.print(
        {
          silent: false,
          printBackground: true,
          pageSize: 'A4',
          margins: {
            marginType: 'default',
          },
        },
        (success, errorType) => {
          if (!success && errorType) {
            console.log('Page setup/Print cancelled or failed:', errorType)
          }
          // 完成後關閉視窗
          printWin.destroy()
        }
      )

      return { success: true }
    } catch (error) {
      console.error('Failed to open page setup:', error)
      return { success: false, error: String(error) }
    }
  })

  // Print - 列印 Markdown 預覽內容
  ipcMain.handle('print:print', async (_event, html: string, title: string) => {
    try {
      // 建立一個隱藏視窗來渲染要列印的內容
      const printWin = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
        },
      })

      const fullHtml = generatePrintHTML(html, title)
      await printWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(fullHtml)}`)

      // 開啟列印對話框
      await printWin.webContents.print(
        {
          silent: false,
          printBackground: true,
          pageSize: 'A4',
          margins: {
            marginType: 'default',
          },
        },
        (success, errorType) => {
          if (!success && errorType) {
            console.log('Print cancelled or failed:', errorType)
          }
          // 列印完成後關閉視窗
          printWin.destroy()
        }
      )

      return { success: true }
    } catch (error) {
      console.error('Failed to print:', error)
      return { success: false, error: String(error) }
    }
  })
}

/**
 * 生成用於列印的 HTML
 */
function generatePrintHTML(content: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Untitled'}</title>
  <style>
    @media print {
      @page {
        margin: 2cm;
      }
    }
    body {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Microsoft JhengHei", sans-serif;
      line-height: 1.6;
      color: #24292e;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    h4 { font-size: 1em; }
    h5 { font-size: 0.875em; }
    h6 { font-size: 0.85em; color: #6a737d; }
    pre {
      background-color: #f6f8fa;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
      font-size: 85%;
    }
    code {
      background-color: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 85%;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #dfe2e5;
      padding-left: 16px;
      color: #6a737d;
      margin: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }
    table th, table td {
      border: 1px solid #dfe2e5;
      padding: 8px 12px;
    }
    table th {
      background-color: #f6f8fa;
      font-weight: 600;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    ul, ol {
      padding-left: 2em;
    }
    li {
      margin: 0.25em 0;
    }
  </style>
</head>
<body>
${content}
</body>
</html>`
}
