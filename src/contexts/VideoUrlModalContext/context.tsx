import { createContext } from 'react';

export interface VideoUrlModalContextType {
  openModal: (onSubmit: (videoId: string) => void | Promise<void>) => void;
  closeModal: () => void;
}

export const VideoUrlModalContext = createContext<VideoUrlModalContextType | undefined>(undefined);
