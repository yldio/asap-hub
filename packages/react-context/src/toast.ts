import { createContext, ReactNode } from 'react';

type Toast = (node: ReactNode) => void;
export const ToastContext = createContext<Toast>(() => {
  throw new Error('No toast display available');
});

export const InnerToastContext = createContext<Toast>(() => {
  throw new Error('No inner toast display available');
});
