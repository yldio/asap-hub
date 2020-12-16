import { createContext, ReactNode } from 'react';

type Toast = (node: ReactNode) => void;
export const ToastContext = createContext<Toast>(() => {
  throw new Error('No toast display available');
});
