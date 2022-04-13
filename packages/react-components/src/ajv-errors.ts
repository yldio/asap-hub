import { ValidationErrorResponse } from '@asap-hub/model';

export const getAjvErrorForPath = (
  errors: ValidationErrorResponse['data'],
  path: string,
  copy: string,
): string | undefined =>
  errors.find(({ instancePath }) => instancePath === path) ? copy : undefined;
