'use client';

import { useEffect } from 'react';

export default function NoteDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
      <p>Could not fetch note details. {error.message}</p>
      <button
        onClick={() => reset()}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  );
}
