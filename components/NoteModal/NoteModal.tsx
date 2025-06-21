// 'use client';

// import { useEffect, useRef } from "react";
// import { createPortal } from "react-dom";
// import NoteForm from "../NoteForm/NoteForm";
// import styles from "@/NoteModal.module.css";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createNote } from "@/lib/api";
// import { type Note, type CreateNotePayload, type Tag } from "@/types/note";

// interface NoteModalProps {
//   onClose: () => void;
// }

// function NoteModal({ onClose }: NoteModalProps) {
//   const modalRef = useRef<HTMLDivElement>(null);
//   const queryClient = useQueryClient();

//   const createNoteMutation = useMutation<Note, Error, CreateNotePayload>({
//   mutationFn: createNote,
//   onSuccess: () => {
//    queryClient.invalidateQueries({ queryKey: ['notes'] });
//     onClose();
//   },
//   onError: (error) => {
//     console.error("Failed to create note:", error);
//   }
// });

//   const handleCreateNote = (title: string, content: string, tag?: Tag) => {
//     createNoteMutation.mutate({ title, content, tag: tag ?? "Todo" });
//   };

//   useEffect(() => {
//     const originalOverflowStyle = document.body.style.overflow;
//     document.body.style.overflow = "hidden";

//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };

//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.body.style.overflow = originalOverflowStyle;
//       document.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

//   if (typeof window === "undefined") return null;

//   return createPortal(
//     <div className={styles.backdrop} role="dialog" aria-modal="true">
//       <div className={styles.modal} ref={modalRef}>
//         <NoteForm
//           onCreateNote={handleCreateNote}
//           isCreating={createNoteMutation.status === 'pending'}
//           onClose={onClose}
//         />
//       </div>
//     </div>,
//     document.body
//   );
// }

// export default NoteModal;

'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import NoteForm from '../NoteForm/NoteForm';
import styles from '@/NoteModal.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { type Note, type CreateNotePayload, type Tag } from '@/types/note';

interface NoteModalProps {
  onClose: () => void;
}

function NoteModal({ onClose }: NoteModalProps) {
  const queryClient = useQueryClient();
  const modalRef = useRef<HTMLDivElement>(null);

  const createNoteMutation = useMutation<Note, Error, CreateNotePayload>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
    },
  });

  const handleCreateNote = (title: string, content: string, tag?: Tag) => {
    createNoteMutation.mutate({ title, content, tag: tag ?? 'Todo' });
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.modal} ref={modalRef}>
        <NoteForm
          onCreateNote={handleCreateNote}
          isCreating={createNoteMutation.status === 'pending'}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body
  );
}

export default NoteModal;
