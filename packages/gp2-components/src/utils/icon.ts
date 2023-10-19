import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import {
  outputArticle,
  outputCode,
  outputDataset,
  outputForm,
  outputMaterial,
  outputReport,
} from '../icons';

export const getIconForDocumentType = (
  documentType: string,
): EmotionJSX.Element => {
  switch (documentType) {
    case 'Article':
      return outputArticle;
    case 'Code/Software':
      return outputCode;
    case 'Dataset':
      return outputDataset;
    case 'GP2 Reports':
      return outputReport;
    case 'Procedural Form':
      return outputForm;
    case 'Training Materials':
      return outputMaterial;
    default:
      return outputReport;
  }
};
