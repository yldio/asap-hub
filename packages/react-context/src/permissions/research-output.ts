import { createContext, useContext } from 'react';

type ResearchOutputPermissions = {
  canCreateUpdate: boolean;
};

export const ResearchOutputPermissionsContext =
  createContext<ResearchOutputPermissions>({
    canCreateUpdate: false,
  });

export const useResearchOutputPermissionsContext =
  (): ResearchOutputPermissions => useContext(ResearchOutputPermissionsContext);
