/* istanbul ignore file */
import { gp2 } from '@asap-hub/model';

export const OutputIdentifierValidationExpression: Record<
  gp2.OutputIdentifierType,
  string | undefined
> = {
  [gp2.OutputIdentifierType.DOI]: '^10.\\d{4}.*$',
  [gp2.OutputIdentifierType.AccessionNumber]: '^\\w+\\d+(\\.(\\w?)\\d+)*$',
  [gp2.OutputIdentifierType.RRID]: '^RRID:[a-zA-Z]+.+$',
  [gp2.OutputIdentifierType.Empty]: undefined,
  [gp2.OutputIdentifierType.None]: undefined,
};
