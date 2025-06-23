'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import NoteForm from '../NoteForm/NoteForm';
import styles from './NoteModal.module.css';

interface NoteModalProps {
  onClose: () => void;
}

function NoteModal({ onClose }: NoteModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);

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
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.modal} ref={modalContentRef}>
        <NoteForm onClose={onClose} />
      </div>
    </div>,
    document.body
  );
}

export default NoteModal;