import type { ResearchOutputListOptions } from '../shared-research/api';

export type ProjectResearchOutputListScopeInput = {
  projectId: string;
  /** Present for team-based projects (Discovery, team-based Resource). */
  teamId?: string;
};

/**
 * Team-based project pages list outputs by funded team; user-based pages filter
 * by direct project association.
 */
export const getProjectResearchOutputListScope = ({
  projectId,
  teamId,
}: ProjectResearchOutputListScopeInput): Pick<
  ResearchOutputListOptions,
  'teamId' | 'projectId'
> => (teamId ? { teamId } : { projectId });
