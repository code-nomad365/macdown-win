import { useMemo } from 'react'
import MarkdownIt from 'markdown-it'

// 建立 markdown-it 實例（只建立一次）
const md = new MarkdownIt({
  html: true, // 允許 HTML 標籤
  linkify: true, // 自動將 URL 轉換為連結
  typographer: true, // 啟用智慧引號等排版功能
  breaks: true, // 將換行符轉換為 <br>
})

/**
 * useMarkdown Hook
 * 將 Markdown 文字轉換為 HTML
 * @param content - Markdown 內容
 * @returns 渲染後的 HTML 字串
 */
export function useMarkdown(content: string): string {
  return useMemo(() => {
    try {
      return md.render(content)
    } catch (error) {
      console.error('Markdown rendering error:', error)
      return '<p>Markdown 渲染錯誤</p>'
    }
  }, [content])
}
