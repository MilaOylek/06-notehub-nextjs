'use client';

import { type Note } from "../../types/note";
import styles from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDeleteNote: (id: number) => void;
  isDeleting: boolean;
}

function NoteList({ notes, onDeleteNote, isDeleting }: NoteListProps) {

  return (
    <>
      {isDeleting && <p>Deleting note...</p>}
      <ul className={styles.list}>
        {notes.map((note) => (
          <li key={note.id} className={styles.listItem}>
            <h2 className={styles.title}>{note.title}</h2>
            <p className={styles.content}>{note.content}</p>
            <div className={styles.footer}>
              {note.tag && <span className={styles.tag}>{note.tag}</span>}
              <button
                className={styles.button}
                onClick={() => {
                  const confirmed = window.confirm("Are you sure you want to delete this note?");
                  if (confirmed) {
                    onDeleteNote(note.id);
                  }
                }}
                disabled={isDeleting}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default NoteList;