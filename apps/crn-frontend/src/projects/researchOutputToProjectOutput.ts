import {
  getProjectResearchOutputDisplaySource,
  ResearchOutputResponse,
} from '@asap-hub/model';
import type { ProjectOutput } from '@asap-hub/react-components';
import { utils } from '@asap-hub/react-components';

export const researchOutputToProjectOutput = (
  output: ResearchOutputResponse,
): ProjectOutput => ({
  id: output.id,
  title: output.title,
  documentType: output.documentType,
  type: output.type,
  authors: output.authors,
  teams: output.teams ?? [],
  keywords: output.keywords,
  published: output.published,
  isInReview: output.isInReview,
  created: output.created,
  addedDate: output.addedDate,
  link: output.link,
  lastModifiedDate: output.lastUpdatedPartial,
  source: getProjectResearchOutputDisplaySource(output),
  project: output.project
    ? {
        id: output.project.id,
        title: output.project.title,
        projectType: output.project.projectType,
        href: utils.getProjectRoute({
          projectId: output.project.id,
          projectType: output.project.projectType,
        }),
      }
    : undefined,
});
