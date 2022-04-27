/* istanbul ignore file */
import { ResearchOutputIdentifierType } from '@asap-hub/model';

export const ResearchOutputIdentifierValidationExpression: Record<
  ResearchOutputIdentifierType,
  string | undefined
> = {
  [ResearchOutputIdentifierType.DOI]: '^(doi:)?\\d{2}\\.\\d{4}.*$',
  [ResearchOutputIdentifierType.AccessionNumber]:
    '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$',
  [ResearchOutputIdentifierType.RRID]: '^RRID:[a-zA-Z]+.+$',
  [ResearchOutputIdentifierType.LabCatalogNumber]: undefined,
  [ResearchOutputIdentifierType.None]: undefined,
  [ResearchOutputIdentifierType.Empty]: undefined,
};
