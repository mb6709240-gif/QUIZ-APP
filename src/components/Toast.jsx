import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);
let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  const show = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++toastId;
    setToasts((p) => [...p, { id, message, type }]);
    if (duration > 0) setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);
  const toast = {
    success: (m, d) => show(m, 'success', d),
    error: (m, d) => show(m, 'error', d),
    warning: (m, d) => show(m, 'warning', d),
    info: (m, d) => show(m, 'info', d),
  };
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} onClick={() => dismiss(t.id)}>
            <span className="toast-icon">{t.type === 'success' ? '\u2713' : t.type === 'error' ? '\u2715' : t.type === 'warning' ? '\u26A0' : '\u2139'}</span>
            <span className="toast-message">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
