'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(initialData.currentPage || 1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const notesPerPage = 10;

  const isHydrationComplete = useRef(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("NotesClient: Debounced search updated to:", searchQuery);
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const queryOptions = {
    queryKey: ['notes', debouncedSearch, currentPage],
    queryFn: async () => { 
      console.log("NotesClient: Executing queryFn for queryKey:", ['notes', debouncedSearch, currentPage]);
      const data = await fetchNotes(currentPage, notesPerPage, debouncedSearch);
        if (!isHydrationComplete.current) {
        isHydrationComplete.current = true;
      }
      return data;
    },
    
    initialData: isHydrationComplete.current ? undefined : initialData,
   
    placeholderData: (previousData: NotesClientProps['initialData'] | undefined) => {
 
      return previousData ?? (isHydrationComplete.current ? undefined : initialData);
    },
  };

  const { data, isLoading, isError, error } = useQuery(queryOptions);

  const handleSearchChange = (value: string) => {
    console.log("NotesClient: Search query updated to (raw):", value);
    setSearchQuery(value);
  };

  const handlePageChange = (selectedPage: number) => {
    console.log("NotesClient: handlePageChange received 0-indexed page:", selectedPage);
    setCurrentPage(selectedPage + 1);
    console.log("NotesClient: New 1-indexed currentPage state set to:", selectedPage + 1);
  };

  useEffect(() => {
    console.log('Current page state changed to:', currentPage);
  }, [currentPage]);

  if (isLoading) return <p className={css.message}>Loading notes...</p>;
  if (isError) return <p className={css.messageError}>Error: {error?.message}</p>;

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

      {notesToDisplay.length > 0 ? (
        <>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          <NoteList notes={notesToDisplay} />
        </>
      ) : (
        <p className={css.noNotesMessage}>No notes found. Create a new one!</p>
      )}
    </div>
  );
};

export default NotesClient;