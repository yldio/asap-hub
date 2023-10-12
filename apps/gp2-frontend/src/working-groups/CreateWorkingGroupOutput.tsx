import { clearAjvErrorForPath } from '@asap-hub/frontend-utils';
import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { ValidationErrorResponse } from '@asap-hub/model';
import { usePrevious } from '@asap-hub/react-components';
import { InnerToastContext } from '@asap-hub/react-context';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { ReactNode, useCallback, useEffect, useState, FC } from 'react';
import {
  handleError,
  useRelatedOutputSuggestions,
  useRelatedEventsSuggestions,
} from '../outputs';
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
  const getRelatedEventSuggestions = useRelatedEventsSuggestions();
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

  const [toastNode, setToastNode] = useState<ReactNode>(undefined);
  const toast = useCallback((node: ReactNode) => setToastNode(node), []);
  const previousToast = usePrevious(toastNode);
  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);
  const previousErrors = usePrevious(errors);

  useEffect(() => {
    if (
      toastNode !== previousToast ||
      (previousErrors && previousErrors?.length < errors.length)
    ) {
      window.scrollTo(0, 0);
    }
  }, [toastNode, errors.length, previousErrors, previousToast]);

  return (
    <InnerToastContext.Provider value={toast}>
      <CreateOutputPage
        documentType={documentTypeMapper[outputDocumentType]}
        entityType="workingGroup"
      >
        <OutputForm
          entityType="workingGroup"
          shareOutput={async (output) =>
            createOutput(output).catch(
              handleError(['/link', '/title'], setErrors),
            )
          }
          documentType={documentTypeMapper[outputDocumentType]}
          getAuthorSuggestions={getAuthorSuggestions}
          tagSuggestions={tagSuggestions}
          getRelatedOutputSuggestions={getRelatedOutputSuggestions}
          getRelatedEventSuggestions={getRelatedEventSuggestions}
          cohortSuggestions={cohortSuggestions}
          workingGroupSuggestions={workingGroupSuggestions}
          projectSuggestions={projectSuggestions}
          mainEntityId={workingGroupId}
          workingGroups={[mainEntity]}
          serverValidationErrors={errors}
          clearServerValidationError={(instancePath: string) =>
            setErrors(clearAjvErrorForPath(errors, instancePath))
          }
        />
      </CreateOutputPage>
    </InnerToastContext.Provider>
  );
};

export default CreateWorkingGroupOutput;
