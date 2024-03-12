import { useContext, useEffect } from 'react';
import { ToastContext } from '@asap-hub/react-context';
import { number } from './knobs';

export const toastGenerator = () => {
  const numToasts = number('Number of toasts', 3, { min: 0 });
  const ToastGenerator: React.FC<Record<string, never>> = () => {
    const toast = useContext(ToastContext);
    useEffect(() => {
      Array.from({ length: numToasts }, (_, i) => `Toast ${i + 1}`).forEach(
        toast,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  };
  return { numToasts, ToastGenerator };
};
