import { useRef, useEffect } from 'react';


function useOutsideClick(handler, listenCapturing = true, enabled = true) {
  const ref = useRef();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    function handleClick(e) {
      const el = ref.current;
      if (!el) return;
      if (el.contains(e.target)) return;

      // Native <select> popups fire clicks that are not inside the dialog.
      const tag = e.target?.tagName;
      if (tag === 'OPTION' || tag === 'SELECT') return;

      handlerRef.current?.();
    }

    // Skip the same click that opened the overlay.
    const timeoutId = window.setTimeout(() => {
      document.addEventListener('click', handleClick, listenCapturing);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener('click', handleClick, listenCapturing);
    };
  }, [enabled, listenCapturing]);

  return ref;
}


export default useOutsideClick
