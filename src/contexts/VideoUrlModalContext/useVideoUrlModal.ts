import { useContext } from 'react';
import { VideoUrlModalContext } from './context';

export function useVideoUrlModal() {
  const context = useContext(VideoUrlModalContext);
  if (!context) {
    throw new Error(
      'useVideoUrlModal must be used within VideoUrlModalProvider',
    );
  }
  return context;
}
