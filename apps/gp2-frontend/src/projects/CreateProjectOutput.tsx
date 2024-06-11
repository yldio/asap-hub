import { clearAjvErrorForPath } from '@asap-hub/frontend-utils';
import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { ValidationErrorResponse, gp2 as gp2Model } from '@asap-hub/model';
import { usePrevious } from '@asap-hub/react-components';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { useEffect, useState, FC } from 'react';
import {
  handleError,
  useRelatedOutputSuggestions,
  useRelatedEventsSuggestions,
  useAuthorSuggestions,
  useOutputGeneratedContent,
} from '../outputs';
import { useCreateOutput } from '../outputs/state';
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

type CreateProjectOutputProps = {
  outputData?: gp2Model.OutputBaseResponse;
};

const CreateProjectOutput: FC<CreateProjectOutputProps> = ({ outputData }) => {
  const { projectId } = useRouteParams(projects({}).project);
  const { outputDocumentType } = useRouteParams(
    projects({}).project({ projectId }).createOutput,
  );
  const createOutput = useCreateOutput();
  const getRelatedOutputSuggestions = useRelatedOutputSuggestions();
  const getRelatedEventSuggestions = useRelatedEventsSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getShortDescriptionFromDescription = useOutputGeneratedContent();
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

  const [errors, setErrors] = useState<ValidationErrorResponse['data']>([]);
  const previousErrors = usePrevious(errors);

  useEffect(() => {
    if (previousErrors && previousErrors?.length < errors.length) {
      window.scrollTo(0, 0);
    }
  }, [errors.length, previousErrors]);

  return (
    <CreateOutputPage
      documentType={
        outputData?.documentType || documentTypeMapper[outputDocumentType]
      }
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
        getShortDescriptionFromDescription={getShortDescriptionFromDescription}
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
        {...outputData}
      />
    </CreateOutputPage>
  );
};

export default CreateProjectOutput;
