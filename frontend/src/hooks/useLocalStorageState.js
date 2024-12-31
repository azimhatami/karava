import { useState, useEffect } from 'react';


function useLocalStorageState(key, initialState) {
  const [value, setValue] = useState(() => {
    const themeValue = localStorage.getItem(key);
    return themeValue ? JSON.parse(themeValue) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue];
}


export default useLocalStorageState
