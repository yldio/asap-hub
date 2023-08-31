import { createContext, ReactNode } from 'react';

export type ToastAccents =
  | 'error'
  | 'info'
  | 'warning'
  | 'success'
  | 'successLarge';

type Toast = (node: ReactNode, accent?: ToastAccents) => void;

export const ToastContext = createContext<Toast>(() => {
  throw new Error('No toast display available');
});

export const InnerToastContext = createContext<Toast>(() => {
  throw new Error('No inner toast display available');
});
