import { useState, ReactNode } from 'react';
import { VideoUrlModal } from '@/components/VideoUrlModal';
import { VideoUrlModalContext } from './context';

interface VideoUrlModalProviderProps {
  children: ReactNode;
}

export function VideoUrlModalProvider({ children }: VideoUrlModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitHandler, setSubmitHandler] = useState<((videoId: string) => void | Promise<void>) | null>(null);

  const openModal = (onSubmit: (videoId: string) => void | Promise<void>) => {
    setSubmitHandler(() => onSubmit);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSubmitHandler(null);
  };

  const handleSubmit = async (videoId: string) => {
    if (submitHandler) {
      await submitHandler(videoId);
    }
    closeModal();
  };

  return (
    <VideoUrlModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <VideoUrlModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </VideoUrlModalContext.Provider>
  );
}
