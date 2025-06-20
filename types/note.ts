export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: number;
  title: string;
  content: string;
  // tag: Tag;
  tag?: string;
   createdDate: string;
}

export interface PaginatedResponse<T> {
  notes: T[];
  page: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
   tag?: string;
  // tag: Tag;
}