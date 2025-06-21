'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { deleteNote } from '@/lib/api';
import { type Note } from '@/types/note';
import styles from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onDeleteNote: (id: number) => void;
  isDeleting: boolean;
}

function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const {
    mutate: deleteNoteById,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDelete = (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this note?');
    if (confirmed) {
      deleteNoteById(id);
    }
  };

  return (
    <>
      {isDeleting && <p>Deleting note...</p>}
      <ul className={styles.list}>
        {notes.map((note) => (
          <li key={note.id} className={styles.listItem}>
            <Link href={`/notes/${note.id}`} className={styles.link}>
              <h2 className={styles.title}>{note.title}</h2>
            </Link>
            <p className={styles.content}>{note.content}</p>
            <div className={styles.footer}>
              {note.tag && <span className={styles.tag}>{note.tag}</span>}
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
