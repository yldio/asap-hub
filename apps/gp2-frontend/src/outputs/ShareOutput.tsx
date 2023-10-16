import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import {
  useRelatedEventsSuggestions,
  useRelatedOutputSuggestions,
} from '../outputs';
import { useProjects } from '../projects/state';
import { useContributingCohorts, useTags } from '../shared/state';
import { useWorkingGroupsState } from '../working-groups/state';

import { useAuthorSuggestions, useUpdateOutput } from './state';

interface ShareOutputProps {
  output: gp2Model.OutputBaseResponse;
}
const ShareOutput: React.FC<ShareOutputProps> = ({
  output,
}: ShareOutputProps) => {
  const entityType =
    output?.mainEntity.type === 'WorkingGroups' ? 'workingGroup' : 'project';
  const shareOutput = useUpdateOutput(output.id);
  const getAuthorSuggestions = useAuthorSuggestions();
  const getRelatedOutputSuggestions = useRelatedOutputSuggestions(output.id);
  const getRelatedEventSuggestions = useRelatedEventsSuggestions();
  const { items: tagSuggestions } = useTags();
  const cohortSuggestions = useContributingCohorts();
  const { items: workingGroupSuggestions } = useWorkingGroupsState();
  const { items: projectSuggestions } = useProjects({
    searchQuery: '',
    pageSize: null,
    currentPage: null,
    filters: new Set(),
  });
  return (
    <CreateOutputPage
      entityType={entityType}
      documentType={output.documentType}
    >
      <OutputForm
        {...output}
        entityType={entityType}
        shareOutput={shareOutput}
        getAuthorSuggestions={getAuthorSuggestions}
        tagSuggestions={tagSuggestions}
        getRelatedOutputSuggestions={getRelatedOutputSuggestions}
        getRelatedEventSuggestions={getRelatedEventSuggestions}
        cohortSuggestions={cohortSuggestions}
        workingGroupSuggestions={workingGroupSuggestions}
        projectSuggestions={projectSuggestions}
        mainEntityId={output.mainEntity.id}
        projects={output.projects}
        workingGroups={output.workingGroups}
      />
    </CreateOutputPage>
  );
};

export default ShareOutput;
