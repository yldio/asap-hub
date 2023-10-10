import {
  CreateOutputPage,
  OutputForm,
  OutputDetailPage,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2, useRouteParams } from '@asap-hub/routing';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useRelatedOutputSuggestions } from '../outputs';
import { useProjects } from '../projects/state';
import { useContributingCohorts, useTags } from '../shared/state';
import { useWorkingGroupsState } from '../working-groups/state';

import { useAuthorSuggestions, useOutputById, useUpdateOutput } from './state';

const ShareOutput: React.FC<Record<string, never>> = () => {
  const { outputId } = useRouteParams(gp2.outputs({}).output);
  const { path } = useRouteMatch();
  const currentUser = useCurrentUserGP2();
  const isAdministrator = currentUser?.role === 'Administrator';

  const output = useOutputById(outputId);
  const entityType =
    output?.mainEntity.type === 'WorkingGroups' ? 'workingGroup' : 'project';
  const shareOutput = useUpdateOutput(outputId);
  const getAuthorSuggestions = useAuthorSuggestions();
  const getRelatedOutputSuggestions = useRelatedOutputSuggestions(outputId);
  const { items: tagSuggestions } = useTags();
  const cohortSuggestions = useContributingCohorts();
  const { items: workingGroupSuggestions } = useWorkingGroupsState();
  const { items: projectSuggestions } = useProjects({
    searchQuery: '',
    pageSize: null,
    currentPage: null,
    filters: new Set(),
  });

  if (!output) {
    return <NotFoundPage />;
  }

  return (
    <Switch>
      <Route exact path={path}>
        <OutputDetailPage isAdministrator={isAdministrator} {...output} />
      </Route>

      <Route path={path + gp2.outputs({}).output({ outputId }).edit.template}>
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
            cohortSuggestions={cohortSuggestions}
            workingGroupSuggestions={workingGroupSuggestions}
            projectSuggestions={projectSuggestions}
            mainEntityId={output.mainEntity.id}
            projects={output.projects}
            workingGroups={output.workingGroups}
          />
        </CreateOutputPage>
      </Route>
    </Switch>
  );
};

export default ShareOutput;
