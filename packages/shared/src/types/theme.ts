export interface Theme {
  id: string
  name: string
  type: 'light' | 'dark'
  editor: EditorTheme
  preview: PreviewTheme
}

export interface EditorTheme {
  background: string
  foreground: string
  selection: string
  lineNumber: string
  cursor: string
}

export interface PreviewTheme {
  css: string
}
