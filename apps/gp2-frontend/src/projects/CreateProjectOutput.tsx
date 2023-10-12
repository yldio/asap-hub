import { clearAjvErrorForPath } from '@asap-hub/frontend-utils';
import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { ValidationErrorResponse, gp2 as gp2Model } from '@asap-hub/model';
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

  const project = useProjectById(projectId);
  const mainEntity = {
    id: projectId,
    title: project?.title || '',
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
        entityType="project"
      >
        <OutputForm
          entityType="project"
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
          projects={[mainEntity]}
          mainEntityId={projectId}
          serverValidationErrors={errors}
          clearServerValidationError={(instancePath: string) =>
            setErrors(clearAjvErrorForPath(errors, instancePath))
          }
        />
      </CreateOutputPage>
    </InnerToastContext.Provider>
  );
};

export default CreateProjectOutput;
