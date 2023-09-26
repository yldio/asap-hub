import { gp2 } from '@asap-hub/model';

const identifierTypeToFieldName: Record<
  gp2.OutputIdentifierType,
  'doi' | 'accessionNumber' | 'rrid' | undefined
> = {
  [gp2.OutputIdentifierType.Empty]: undefined,
  [gp2.OutputIdentifierType.None]: undefined,
  [gp2.OutputIdentifierType.DOI]: 'doi',
  [gp2.OutputIdentifierType.AccessionNumber]: 'accessionNumber',
  [gp2.OutputIdentifierType.RRID]: 'rrid',
};

export const createIdentifierField = (
  identifierType: gp2.OutputIdentifierType,
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
