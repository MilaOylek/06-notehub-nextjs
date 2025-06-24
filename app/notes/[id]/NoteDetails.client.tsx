'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetails.module.css';
import type { Note } from '@/types/note';

const NoteDetailsClient = () => {
  const params = useParams();
  const noteId = parseInt(params.id as string, 10);

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note | null, Error>({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId,
    refetchOnMount: false,
  });

  if (isLoading) return <p className={css.message}>Loading, please wait...</p>; 
  if (isError) return <p className={css.messageError}>Could not fetch note details. {error?.message}</p>;
  if (!note) return <p className={css.message}>Note not found.</p>;

  const formattedDate = note.createdAt 
    ? new Date(note.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <button className={css.editBtn}>Edit note</button>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>Created: {formattedDate}</p>
        {note.tag && <p className={css.tag}>Tag: {note.tag}</p>}
      </div>
    </div>
  );
};

export default NoteDetailsClient;