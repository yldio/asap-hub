/* istanbul ignore file */
import { ResearchOutputIdentifierType } from '@asap-hub/model';

export const ResearchOutputIdentifierValidationExpression: Record<
  ResearchOutputIdentifierType,
  string | undefined
> = {
  [ResearchOutputIdentifierType.DOI]: '^10\\.\\d{4}.*$',
  [ResearchOutputIdentifierType.AccessionNumber]:
    '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$',
  [ResearchOutputIdentifierType.RRID]: '^RRID:[a-zA-Z]+.+$',
  [ResearchOutputIdentifierType.Empty]: undefined,
  [ResearchOutputIdentifierType.None]: undefined,
};
