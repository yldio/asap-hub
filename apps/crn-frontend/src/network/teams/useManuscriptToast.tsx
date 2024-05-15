import { useContext } from 'react';

import { ManuscriptToastContext } from './ManuscriptToastProvider';

export const useManuscriptToast = () => useContext(ManuscriptToastContext);
