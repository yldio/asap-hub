import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { FC } from 'react';
import { useRelatedOutputSuggestions } from '../outputs';
import { useAuthorSuggestions, useCreateOutput } from '../outputs/state';
import { useContributingCohorts, useTags } from '../shared/state';
import { useWorkingGroupsState } from '../working-groups/state';
import { useProjectById, useProjects } from './state';

const { projects } = gp2Routing;

export const documentTypeMapper: Record<
  gp2Routing.OutputDocumentTypeParameter,
  gp2Model.OutputDocumentType
> = {
  article: 'Article',
  'code-software': 'Code/Software',
  dataset: 'Dataset',
  'procedural-form': 'Procedural Form',
  'training-materials': 'Training Materials',
  'gp2-reports': 'GP2 Reports',
};

const CreateProjectOutput: FC<Record<string, never>> = () => {
  const { projectId } = useRouteParams(projects({}).project);
  const { outputDocumentType } = useRouteParams(
    projects({}).project({ projectId }).createOutput,
  );
  const createOutput = useCreateOutput();
  const getRelatedOutputSuggestions = useRelatedOutputSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const { items: tagSuggestions } = useTags();
  const cohortSuggestions = useContributingCohorts();
  const { items: workingGroupSuggestions } = useWorkingGroupsState();
  const { items: projectSuggestions } = useProjects({
    searchQuery: '',
    pageSize: null,
    currentPage: null,
    filters: new Set(),
  });

  const project = useProjectById(projectId);
  const mainEntity = {
    id: projectId,
    title: project?.title || '',
  };

  return (
    <CreateOutputPage
      documentType={documentTypeMapper[outputDocumentType]}
      entityType="project"
    >
      <OutputForm
        entityType="project"
        shareOutput={createOutput}
        documentType={documentTypeMapper[outputDocumentType]}
        getAuthorSuggestions={getAuthorSuggestions}
        tagSuggestions={tagSuggestions}
        getRelatedOutputSuggestions={getRelatedOutputSuggestions}
        cohortSuggestions={cohortSuggestions}
        workingGroupSuggestions={workingGroupSuggestions}
        projectSuggestions={projectSuggestions}
        projects={[mainEntity]}
        mainEntityId={projectId}
      />
    </CreateOutputPage>
  );
};

export default CreateProjectOutput;
