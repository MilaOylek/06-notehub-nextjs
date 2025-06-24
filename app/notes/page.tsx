import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import type { Note } from '@/types/note';

type NotesData = {
  notes: Note[];
  page: number;
  totalPages: number;
  currentPage: number;
};

export default async function NotesPage({
  searchParams,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: any; // <--- ЗАСТОСУЙТЕ ЦЕЙ КОМЕНТАР ESLINT ТА 'any' ТИП
}) {
  const { page: pageParam, search: searchParam } = searchParams;

  const queryClient = new QueryClient();
  const notesPerPage = 10;

  const currentPage = parseInt(pageParam || '1', 10);
  const searchQuery = searchParam || '';

  await queryClient.prefetchQuery({
    queryKey: ['notes', searchQuery, currentPage],
    queryFn: () => fetchNotes(currentPage, notesPerPage, searchQuery),
  });

  const initialData = queryClient.getQueryData([
    'notes',
    searchQuery,
    currentPage,
  ]) as NotesData;

  const finalInitialData: NotesData = initialData || {
    notes: [],
    page: currentPage,
    totalPages: 1,
    currentPage: currentPage,
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialData={finalInitialData} />
    </HydrationBoundary>
  );
}