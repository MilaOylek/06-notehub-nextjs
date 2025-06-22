'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
// import NoteForm from '../NoteForm/NoteForm';
import styles from '@/components/NoteModal/NoteModal.module.css';


interface NoteModalProps {
  onClose: () => void;
  children: React.ReactNode;
}
function NoteModal({ onClose, children }: NoteModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal} ref={modalContentRef}>
        {' '}
        {children}
      </div>
    </div>,
    document.body
  );
}

export default NoteModal;
