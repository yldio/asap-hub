import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { FC } from 'react';
import { useRelatedOutputSuggestions } from '../outputs';
import { useAuthorSuggestions, useCreateOutput } from '../outputs/state';
import { documentTypeMapper } from '../projects/CreateProjectOutput';
import { useProjects } from '../projects/state';
import { useTags, useContributingCohorts } from '../shared/state';
import { useWorkingGroupById, useWorkingGroupsState } from './state';

const { workingGroups } = gp2Routing;

const CreateWorkingGroupOutput: FC<Record<string, never>> = () => {
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);

  const { outputDocumentType } = useRouteParams(
    workingGroups({}).workingGroup({ workingGroupId }).createOutput,
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

  const workingGroup = useWorkingGroupById(workingGroupId);
  const mainEntity = {
    id: workingGroupId,
    title: workingGroup?.title || '',
  };

  return (
    <CreateOutputPage
      documentType={documentTypeMapper[outputDocumentType]}
      entityType="workingGroup"
    >
      <OutputForm
        entityType="workingGroup"
        shareOutput={createOutput}
        documentType={documentTypeMapper[outputDocumentType]}
        getAuthorSuggestions={getAuthorSuggestions}
        tagSuggestions={tagSuggestions}
        getRelatedOutputSuggestions={getRelatedOutputSuggestions}
        cohortSuggestions={cohortSuggestions}
        workingGroupSuggestions={workingGroupSuggestions}
        projectSuggestions={projectSuggestions}
        mainEntityId={workingGroupId}
        workingGroups={[mainEntity]}
      />
    </CreateOutputPage>
  );
};

export default CreateWorkingGroupOutput;
