import { OutputIdentifierType } from '@asap-hub/model/src/gp2';

const identifierTypeToFieldName: Record<
  OutputIdentifierType,
  'doi' | 'accessionNumber' | 'rrid' | undefined
> = {
  [OutputIdentifierType.Empty]: undefined,
  [OutputIdentifierType.None]: undefined,
  [OutputIdentifierType.DOI]: 'doi',
  [OutputIdentifierType.AccessionNumber]: 'accessionNumber',
  [OutputIdentifierType.RRID]: 'rrid',
};

export const createIdentifierField = (
  identifierType: OutputIdentifierType,
  rawIdentifier: string,
):
  | { rrid: string }
  | { doi: string }
  | { accessionNumber: string }
  | Record<never, never> => {
  const fieldName = identifierTypeToFieldName[identifierType];
  if (fieldName) {
    return { [fieldName]: rawIdentifier };
  }

  return {};
};
