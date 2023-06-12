import { createContext, useContext } from 'react';

export type ResearchOutputPermissions = {
  canShareResearchOutput?: boolean;
  canEditResearchOutput?: boolean;
  canPublishResearchOutput?: boolean;
  canDuplicateResearchOutput?: boolean;
  canRequestReview?: boolean;
};

export const ResearchOutputPermissionsContext =
  createContext<ResearchOutputPermissions>({
    canShareResearchOutput: false,
    canEditResearchOutput: false,
    canPublishResearchOutput: false,
    canDuplicateResearchOutput: false,
    canRequestReview: false,
  });

export const useResearchOutputPermissionsContext =
  (): ResearchOutputPermissions => useContext(ResearchOutputPermissionsContext);
