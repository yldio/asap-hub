import { createContext, useContext } from 'react';
import { UserPermissions } from '@asap-hub/model';
import { noPermissions } from '@asap-hub/validation';

type ResearchOutputPermissions = {
  permissions: UserPermissions;
};

export const ResearchOutputPermissionsContext =
  createContext<ResearchOutputPermissions>({
    permissions: noPermissions,
  });

export const useResearchOutputPermissionsContext =
  (): ResearchOutputPermissions => useContext(ResearchOutputPermissionsContext);
