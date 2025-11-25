import { useContext } from 'react';

import { ManuscriptToastContext } from './ManuscriptToastProvider';

export const useManuscriptToast = () => {
  const context = useContext(ManuscriptToastContext);
  if (!context.setFormType) {
    console.error(
      'useManuscriptToast must be used within a ManuscriptToastProvider',
    );
  }
  return context;
};
