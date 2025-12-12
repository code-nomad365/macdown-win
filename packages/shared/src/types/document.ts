export interface Document {
  id: string
  title: string
  content: string
  folderId: string | null
  createdAt: number
  updatedAt: number
}

export interface Folder {
  id: string
  name: string
  parentId: string | null
  createdAt: number
}

export interface Tag {
  id: string
  name: string
  color: string | null
  createdAt: number
}
