'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';
import { type Note } from '@/types/note';
import styles from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { mutate } = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setDeletingId(null);
    },
    onError: (error) => {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
      setDeletingId(null);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      mutate(id);
    }
  };

  return (
    <ul className={styles.list}>
      {notes.map(note => (
        <li key={note.id} className={styles.listItem}>
          <Link href={`/notes/${note.id}`} className={styles.link}>
            <h2 className={styles.title}>{note.title}</h2>
          </Link>
          <p className={styles.content}>{note.content}</p>
          <div className={styles.footer}>
            <span className={styles.tag}>{note.tag || 'No tag'}</span>
            <Link href={`/notes/${note.id}`} className={styles.detailsLink}>
              View details
            </Link>
            <button
              className={styles.button}
              onClick={() => handleDelete(note.id)}
              disabled={deletingId === note.id}
            >
              {deletingId === note.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
