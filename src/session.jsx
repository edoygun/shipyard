import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.session()
      .then((data) => setUser(data.user))
      .finally(() => setReady(true));
  }, []);

  const value = {
    user,
    ready,
    signIn: async (handle, name) => setUser((await api.signIn(handle, name)).user),
    signOut: async () => {
      await api.signOut();
      setUser(null);
    },
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
