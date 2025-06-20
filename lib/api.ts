import axios from "axios";
import {
  type Note,
  type PaginatedResponse,
  type CreateNotePayload,
} from "@/types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!TOKEN) {
  console.error(
    "NEXT_PUBLIC_NOTEHUB_TOKEN is not set. Please check your .env.local file."
  );
}

const notehubApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = ""
): Promise<PaginatedResponse<Note>> => {
  try {
    const params: { page: number; perPage: number; search?: string } = {
      page,
      perPage,
    };

    if (search) {
      params.search = search;
    }

    const response = await notehubApi.get<PaginatedResponse<Note>>("/notes", {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching notes:",
        error.response?.data || error.message
      );
      if (error.response?.data?.validation) {
        console.error("Validation details:", error.response.data.validation);
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch notes"
      );
    }
    throw error;
  }
};

export const createNote = async (
  noteData: CreateNotePayload
): Promise<Note> => {
  try {
    const response = await notehubApi.post<Note>("/notes", noteData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating note:",
        error.response?.data || error.message
      );
      if (error.response?.data?.validation) {
        console.error(
          "API Validation details:",
          error.response.data.validation
        );
      }
      throw new Error(
        error.response?.data?.message || "Failed to create note"
      );
    }
    throw error;
  }
};

export const deleteNote = async (id: number): Promise<void> => {
  try {
    await notehubApi.delete(`/notes/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting note:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to delete note"
      );
    }
    throw error;
  }
};


export const fetchNoteById = async (id: number): Promise<Note> => {
  try {
    const response = await notehubApi.get<Note>(`/notes/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching note by id:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch note details"
      );
    }
    throw error;
  }
};
