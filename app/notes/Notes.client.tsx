'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, deleteNote } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteModal from '@/components/NoteModal/NoteModal';
import css from './notes.module.css';
import type { Note } from '@/types/note';

type NotesClientProps = {
  initialData: {
    notes: Note[];
    page: number;
    totalPages: number;
    currentPage: number;
  };
};

const NotesClient = ({ initialData }: NotesClientProps) => {
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(initialData.currentPage || 1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const notesPerPage = 10;

 useEffect(() => {
    const handler = setTimeout(() => {
        console.log("NotesClient: Debounced search updated to:", searchQuery);
        setDebouncedSearch(searchQuery);
        setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
}, [searchQuery]); 

const { data, isLoading, isError, error } = useQuery({
  queryKey: ['notes', debouncedSearch, currentPage],
  queryFn: () => {
    console.log("NotesClient: Fetching notes with search:", debouncedSearch);
    return fetchNotes(currentPage, notesPerPage, debouncedSearch);
  },
  // initialData: initialData,
  // placeholderData: previousData => previousData,
});


  const deleteNoteMutation = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (err) => {
      console.error('Error deleting note:', err);
      alert('Failed to delete note. Please try again.');
    }
  });

const handleDeleteNote = (id: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNoteMutation.mutate(id);
    }
  };

  const handleSearchChange = (value: string) => {
     console.log("NotesClient: Search query updated to (raw):", value);
    setSearchQuery(value);
  };

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage + 1);
  };

  useEffect(() => {
    console.log('Current page changed to:', currentPage);
  }, [currentPage]);

  if (isLoading) return <p className={css.message}>Loading notes...</p>;
  if (isError)
    return <p className={css.messageError}>Error: {error?.message}</p>;

  const notesToDisplay = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.container}>
      <SearchBox value={searchQuery} onChange={handleSearchChange} />

      <button
        className={css.openFormButton}
        onClick={() => setIsFormOpen(true)}
        disabled={isFormOpen}
      >
        Create note
      </button>

      {isFormOpen && <NoteModal onClose={() => setIsFormOpen(false)} />}

  {deleteNoteMutation.isError && (
        <p className={css.messageError}>
          Failed to delete note: {deleteNoteMutation.error?.message || 'Unknown error'}
        </p>
      )}

      {notesToDisplay.length > 0 ? (
        <>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          <NoteList
            notes={notesToDisplay}
            onDeleteNote={handleDeleteNote}
            isDeleting={deleteNoteMutation.isPending}
          />
        </>
      ) : (
        <p className={css.noNotesMessage}>No notes found. Create a new one!</p>
      )}
    </div>
  );
};

export default NotesClient;
