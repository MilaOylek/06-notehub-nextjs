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

  // Використовуємо useRef для відстеження, чи була гідратація.
  // Це дозволить нам керувати initialData лише при першому рендері.
  const isHydrationComplete = useRef(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("NotesClient: Debounced search updated to:", searchQuery);
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // При зміні пошуку завжди повертаємося на першу сторінку
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Якщо `initialData` вже була використана для гідратації, більше не передаємо її
  // як опцію `initialData` до `useQuery`.
  // Замість цього, ми дозволяємо TanStack Query керувати кешом самостійно.
  const queryOptions = {
    queryKey: ['notes', debouncedSearch, currentPage],
    queryFn: async () => { // queryFn має бути async
      console.log("NotesClient: Executing queryFn for queryKey:", ['notes', debouncedSearch, currentPage]);
      const data = await fetchNotes(currentPage, notesPerPage, debouncedSearch);
      // Після успішного завантаження/гідратації, відзначаємо, що гідратація завершена
      if (!isHydrationComplete.current) {
        isHydrationComplete.current = true;
      }
      return data;
    },
    // `initialData` використовуємо лише якщо гідратація ще не відбулася
    // і ми хочемо, щоб TanStack Query заповнив кеш з цих пропсів.
    // Якщо `isHydrationComplete.current` є true, initialData не передається,
    // і TanStack Query використовує свої механізми кешування та `queryFn`.
    initialData: isHydrationComplete.current ? undefined : initialData,
    // placeholderData для плавного переходу, коли дані завантажуються
    placeholderData: (previousData: NotesClientProps['initialData'] | undefined) => {
      // Якщо є попередні дані в кеші, використовуємо їх.
      // Інакше, якщо це перший рендер і initialData доступна, використовуємо initialData.
      return previousData ?? (isHydrationComplete.current ? undefined : initialData);
    },
    // staleTime: Infinity, // Якщо ви хочете, щоб дані ніколи не були застарілими
    // gcTime: Infinity, // Якщо ви хочете, щоб дані ніколи не видалялися з кешу
    // Важливо: onSuccess зазвичай не використовується безпосередньо в об'єкті опцій useQuery
    // коли initialData може бути undefined.
    // Логіка isHydrationComplete тепер вмонтована в queryFn.
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