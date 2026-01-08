import { useState } from 'react';

export const useDismissable = (key: string) => {
  const [isDismissed, setIsDismissed] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem(key) === 'true',
  );

  const dismiss = () => {
    localStorage.setItem(key, 'true');
    setIsDismissed(true);
  };

  return [isDismissed, dismiss] as const;
};
