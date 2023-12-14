import { ResearchOutputDocumentType } from '@asap-hub/model';
import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';

import {
  article,
  bioinformatics,
  dataset,
  grantDocument,
  labResource,
  protocol,
} from '../icons';

const icons: Record<ResearchOutputDocumentType, EmotionJSX.Element> = {
  Protocol: protocol,
  Article: article,
  Dataset: dataset,
  Bioinformatics: bioinformatics,
  'Lab Resource': labResource,
  'Grant Document': grantDocument,
  Presentation: protocol,
  Report: protocol,
};

export const getIconForDocumentType = (
  documentType: ResearchOutputDocumentType,
): EmotionJSX.Element => icons[documentType];
