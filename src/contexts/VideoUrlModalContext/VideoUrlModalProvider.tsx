import { type ReactNode, useState } from 'react';
import { VideoUrlModal } from '@/components/VideoUrlModal';
import { VideoUrlModalContext } from './context';

interface VideoUrlModalProviderProps {
  children: ReactNode;
}

export function VideoUrlModalProvider({
  children,
}: VideoUrlModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    setIsOpen(false);
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
