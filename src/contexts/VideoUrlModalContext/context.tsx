import { createContext } from 'react';

export interface VideoUrlModalContextType {
  openModal: () => void;
  closeModal: () => void;
}

export const VideoUrlModalContext = createContext<
  VideoUrlModalContextType | undefined
>(undefined);
