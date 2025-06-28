import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

const Notes = async () => {
  const notes = await fetchNotes({ page: 1 });
  return (
      <NotesClient initialData={notes} />
  )
}

export default Notes;


