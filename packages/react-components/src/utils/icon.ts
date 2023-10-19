import { EmotionJSX } from '@emotion/react/types/jsx-namespace';

import {
  protocol,
  article,
  dataset,
  bioinformatics,
  labResource,
  grantDocument,
} from '../icons';

export const getIconForDocumentType = (
  documentType: string,
): EmotionJSX.Element => {
  switch (documentType) {
    case 'Protocol':
      return protocol;
    case 'Article':
      return article;
    case 'Dataset':
      return dataset;
    case 'Bioinformatics':
      return bioinformatics;
    case 'Lab Resource':
      return labResource;
    case 'Grant Document':
      return grantDocument;
    default:
      return protocol;
  }
};
