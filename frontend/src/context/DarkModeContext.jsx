import { createContext, useContext, useState, useEffect } from 'react';


const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const themeValue = localStorage.getItem('isDarkMode') || null;
    return themeValue ? JSON.parse(themeValue) : false;
  });
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev)

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  return(
    <DarkModeContext.Provider value={{isDarkMode, toggleDarkMode}}>
      {children}
    </DarkModeContext.Provider>
  );
}


export function useDarkMode() {
  const context = useContext(DarkModeContext)

  if (context === undefined) 
    throw new Error('DarkModeContext was used outside of DarkModeProvider');

  return context;
}
