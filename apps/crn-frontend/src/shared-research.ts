import {
  TeamOutputDocumentTypeParameter,
  WorkingGroupOutputDocumentTypeParameter,
} from '@asap-hub/routing';
import {
  BackendError,
  validationErrorsAreSupported,
} from '@asap-hub/frontend-utils';

import {
  isValidationErrorResponse,
  ResearchOutputDocumentType,
  ValidationErrorResponse,
} from '@asap-hub/model';

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

export const handleError =
  (
    supportedErrors: string[],
    setErrors: (errors: ValidationErrorResponse['data']) => void,
  ) =>
  (error: unknown) => {
    if (error instanceof BackendError) {
      const { response } = error;
      if (
        isValidationErrorResponse(response) &&
        validationErrorsAreSupported(response, supportedErrors)
      ) {
        setErrors(response.data);
        return;
      }
    }
    throw error;
  };
