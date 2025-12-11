export interface Document {
  id: string
  title: string
  content: string
  folderId?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, unknown>
}
