import { gp2 } from '@asap-hub/model';

export const getExternalUserCreateDataObject =
  (): gp2.ExternalUserCreateDataObject => ({
    name: 'External User',
    orcid: 'orcid-1',
  });
