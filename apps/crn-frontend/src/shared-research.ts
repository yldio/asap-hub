import {
  TeamOutputDocumentTypeParameter,
  WorkingGroupOutputDocumentTypeParameter,
} from '@asap-hub/routing';

import { ResearchOutputDocumentType } from '@asap-hub/model';

export function paramOutputDocumentTypeToResearchOutputDocumentType(
  data:
    | TeamOutputDocumentTypeParameter
    | WorkingGroupOutputDocumentTypeParameter,
): ResearchOutputDocumentType {
  switch (data) {
    case 'article':
      return 'Article';
    case 'bioinformatics':
      return 'Bioinformatics';
    case 'dataset':
      return 'Dataset';
    case 'lab-resource':
      return 'Lab Resource';
    case 'protocol':
      return 'Protocol';
    case 'report':
      return 'Report';
    default:
      return 'Article';
  }
}
