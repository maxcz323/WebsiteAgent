'use client';

import { useEffect } from 'react';

export function ProfileSync() {
  useEffect(() => {
    fetch('/api/profile/sync', { method: 'POST' });
  }, []);

  return null;
}
