'use client';

import Link from 'next/link';
import { type Note } from '@/types/note';
import styles from './NoteList.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';

interface NoteListProps {
  notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => {
      return deleteNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
        console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
    },
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      mutate(id);
    }
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
                disabled={isPending}
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