'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface ProfileContextType {
  name: string;
  refresh: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({ name: '', refresh: async () => {} });

export function useProfile() {
  return useContext(ProfileContext);
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('');

  const refresh = useCallback(async () => {
    const res = await fetch('/api/profile');
    if (res.ok) {
      const data = await res.json();
      setName(data.full_name ?? '');
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <ProfileContext.Provider value={{ name, refresh }}>
      {children}
    </ProfileContext.Provider>
  );
}
