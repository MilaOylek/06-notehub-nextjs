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

export default async function NotesPage() {
  const queryClient = new QueryClient();
  const page = 1;
  const notesPerPage = 10;
  const search = '';

  await queryClient.prefetchQuery({
    queryKey: ['notes', search, page],
    queryFn: () => fetchNotes(page, notesPerPage, search),
  });

  const initialData = queryClient.getQueryData([
    'notes',
    search,
    page,
  ]) as NotesData;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialData={initialData} />
    </HydrationBoundary>
  );
}
