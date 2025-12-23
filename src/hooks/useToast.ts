import { useCallback, useState } from 'react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: 'error' | 'success' | 'info' = 'error') => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    [],
  );

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    closeToast,
  };
};
