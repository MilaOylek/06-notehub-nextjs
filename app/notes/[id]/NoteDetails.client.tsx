'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetails.module.css';

const NoteDetailsClient = () => {
  const params = useParams();
  const noteId = parseInt(params.id as string, 10);

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;
  if (!note) return <p>Note not found.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>Note title</h2>
          <button className={css.editBtn}>Edit note</button>
        </div>
        <p className={css.content}>Note content</p>
        <p className={css.date}>Created date</p>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
