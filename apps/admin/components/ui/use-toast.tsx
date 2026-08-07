import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  return (
    <ToastContext.Provider value={{ toasts, addToast: (t) => setToasts([...toasts, t]) }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
