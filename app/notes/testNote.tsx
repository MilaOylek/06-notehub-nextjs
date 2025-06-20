'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, createNote, deleteNote } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import NoteForm from '@/components/NoteForm/NoteForm';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import css from './notes.module.css';
import type { CreateNotePayload, Note, PaginatedResponse } from '@/types/note';

const NotesClient = () => {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const notesPerPage = 10;

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<PaginatedResponse<Note>, Error>({
    queryKey: ['notes', searchQuery, currentPage],
    queryFn: () => fetchNotes(currentPage, notesPerPage, searchQuery),
    placeholderData: (previousData) => previousData,
  });

  const createNoteMutation = useMutation<Note, Error, CreateNotePayload>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setCurrentPage(1);
      setIsFormOpen(false);
    },
    onError: (err) => {
      console.error('Error creating note:', err);
    },
  });

  const deleteNoteMutation = useMutation<void, Error, number>({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (err) => {
      console.error('Error deleting note:', err);
    },
  });

  const handleCreateNote = (title: string, content: string, tag?: Note['tag']) => {
    createNoteMutation.mutate({
      title,
      content,
      tag,
    });
  };

  const handleDeleteNote = (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this note?');
    if (confirmed) {
      deleteNoteMutation.mutate(id);
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if (isLoading) return <p className={css.message}>Loading notes...</p>;
  if (isError) return <p className={css.messageError}>Error: {error?.message}</p>;

  const notesToDisplay = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.container}>
      <SearchBox value={searchQuery} onChange={setSearchQuery} />

      <button
        className={css.openFormButton}
        onClick={() => setIsFormOpen(true)}
        disabled={isFormOpen}
      >
       Create note
      </button>

      {isFormOpen && (
        <NoteForm
          onCreateNote={handleCreateNote}
          isCreating={createNoteMutation.isPending}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {createNoteMutation.isError && (
        <p className={css.messageError}>
          Failed to create note: {createNoteMutation.error?.message}
        </p>
      )}
      {deleteNoteMutation.isError && (
        <p className={css.messageError}>
          Failed to delete note: {deleteNoteMutation.error?.message}
        </p>
      )}

      {notesToDisplay.length > 0 ? (
        <>
         <NoteList
  notes={notesToDisplay}
  onDeleteNote={handleDeleteNote}
  isDeleting={deleteNoteMutation.isPending}
/>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className={css.noNotesMessage}>No notes found. Create a new one!</p>
      )}
    </div>
  );
};

export default NotesClient;
