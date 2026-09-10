/* eslint-disable react-refresh/only-export-components -- context module exports provider + hook */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const PanelNavContext = createContext(null);

export function PanelNavProvider({ roleLabel, navItems, children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((open) => !open), []);

  useEffect(() => {
    if (!isDrawerOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  const value = useMemo(
    () => ({
      roleLabel,
      navItems,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [roleLabel, navItems, isDrawerOpen, openDrawer, closeDrawer, toggleDrawer],
  );

  return (
    <PanelNavContext.Provider value={value}>{children}</PanelNavContext.Provider>
  );
}

export function usePanelNav() {
  const context = useContext(PanelNavContext);
  if (!context) {
    throw new Error('usePanelNav must be used within PanelNavProvider');
  }
  return context;
}
