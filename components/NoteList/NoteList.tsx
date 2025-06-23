'use client';

import Link from 'next/link';
import { type Note } from '@/types/note';
import styles from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
   onDeleteNote: (id: number) => void;
  isDeleting: boolean;
}
function NoteList({ notes, onDeleteNote, isDeleting }: NoteListProps) {
  const handleDelete = (id: number) => {
    onDeleteNote(id);
  };

  return (
    <>
      <ul className={styles.list}>
        {notes.map(note => (
          <li key={note.id} className={styles.listItem}>
            <Link href={`/notes/${note.id}`} className={styles.link}>
              <h2 className={styles.title}>{note.title}</h2>
            </Link>
            <p className={styles.content}>{note.content}</p>
            <div className={styles.footer}>
              {note.tag && <span className={styles.tag}>{note.tag}</span>}
              <Link href={`/notes/${note.id}`} className={styles.detailsLink}>
                View details
              </Link>
              <button
                className={styles.button}
                onClick={() => handleDelete(note.id)}
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
