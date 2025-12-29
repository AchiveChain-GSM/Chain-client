// src/hooks/usePersistedState.js
import { useEffect, useState } from 'react';

export default function usePersistedState(key, defaultValue, storage = 'local') {
  const store = storage === 'session' ? sessionStorage : localStorage;

  const [state, setState] = useState(() => {
    try {
      const raw = store.getItem(key);
      return raw != null ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      store.setItem(key, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [key, state]);

  return [state, setState];
}
