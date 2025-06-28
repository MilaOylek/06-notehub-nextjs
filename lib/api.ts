import axios from "axios";
import { type Note, type CreateNotePayload } from "@/types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!TOKEN) {
  const msg = "NEXT_PUBLIC_NOTEHUB_TOKEN is not set. Please check your .env.local file.";
  if (process.env.NODE_ENV === "development") {
    throw new Error(msg);
  } else {
    console.warn(msg);
  }
}

const notehubApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  currentPage: number;
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    console.error(defaultMessage, error.response?.data || error.message);
    throw new ApiError(message, error.response?.status, error.response?.data);
  }
  throw error;
};
export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  try {

const params: FetchNotesParams = { page, perPage };
if (search) params.search = search;

    const response = await notehubApi.get<FetchNotesResponse>("/notes", { params });
    return response.data;
  } catch (error) {
    handleApiError(error, "Error fetching notes:");
    throw error;
  }
};

export const fetchNoteById = async (id: number): Promise<Note> => {
  if (!id || isNaN(id)) throw new Error("Invalid note ID");

  try {
    const response = await notehubApi.get<Note>(`/notes/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error fetching note by id:");
    throw error;
  }
};

export const createNote = async (noteData: CreateNotePayload): Promise<Note> => {
  try {
    const response = await notehubApi.post<Note>("/notes", noteData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error creating note:");
    throw error;
  }
};

export const deleteNote = async (id: number): Promise <Note> => {
  if (!id || isNaN(id)) throw new Error("Invalid note ID");
  try {
    const response = await notehubApi.delete<Note>(`/notes/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error deleting note:");
    throw error;
  }
};
