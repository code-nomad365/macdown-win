import { ipcMain, dialog, BrowserWindow } from 'electron'
import { writeFile } from 'fs/promises'

/**
 * 註冊匯出相關的 IPC handlers
 */
export function registerExportHandlers() {
  // 匯出為 HTML
  ipcMain.handle('export:html', async (_event, html: string, title: string) => {
    const result = await dialog.showSaveDialog({
      filters: [
        { name: 'HTML Files', extensions: ['html'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      defaultPath: `${title || 'untitled'}.html`,
    })

    if (result.canceled || !result.filePath) {
      return null
    }

    const fullHtml = generateHTMLDocument(html, title)

    try {
      await writeFile(result.filePath, fullHtml, 'utf-8')
      return {
        success: true,
        filePath: result.filePath,
      }
    } catch (error) {
      console.error('Failed to export HTML:', error)
      throw error
    }
  })

  // 匯出為 PDF
  ipcMain.handle('export:pdf', async (_event, html: string, title: string) => {
    const result = await dialog.showSaveDialog({
      filters: [
        { name: 'PDF Files', extensions: ['pdf'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      defaultPath: `${title || 'untitled'}.pdf`,
    })

    if (result.canceled || !result.filePath) {
      return null
    }

    try {
      // 建立一個隱藏視窗來渲染 PDF
      const win = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
        },
      })

      const fullHtml = generateHTMLDocument(html, title)
      await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(fullHtml)}`)

      const pdfData = await win.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
        margins: {
          top: 1,
          bottom: 1,
          left: 1,
          right: 1,
        },
      })

      await writeFile(result.filePath, pdfData)

      win.destroy()

      return {
        success: true,
        filePath: result.filePath,
      }
    } catch (error) {
      console.error('Failed to export PDF:', error)
      throw error
    }
  })
}

/**
 * 生成完整的 HTML 文件
 */
function generateHTMLDocument(content: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Untitled'}</title>
  <style>
    body {
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #24292e;
    }
    pre {
      background-color: #f6f8fa;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
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
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    table th, table td {
      border: 1px solid #dfe2e5;
      padding: 8px 12px;
    }
    table th {
      background-color: #f6f8fa;
    }
    img {
      max-width: 100%;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
${content}
</body>
</html>`
}
