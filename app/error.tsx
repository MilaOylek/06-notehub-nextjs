'use client';

import { useEffect } from 'react';

export default function Error({
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
    <div style={{ padding: 20, backgroundColor: '#ffe6e6', color: '#900', borderRadius: 8 }}>
      <h2>Something went wrong globally!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()} style={{ marginTop: 10, padding: '8px 16px' }}>
        Try again
      </button>
    </div>
  );
}