import { useState, useEffect } from 'react';


function useLocalStorageState(key, initialState) {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota or privacy mode errors.
    }
  }, [value, key]);

  return [value, setValue];
}


export default useLocalStorageState
