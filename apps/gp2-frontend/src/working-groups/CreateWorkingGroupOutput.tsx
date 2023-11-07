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
} from '../outputs';
import { useCreateOutput } from '../outputs/state';
import { documentTypeMapper } from '../projects/CreateProjectOutput';
import { useProjects } from '../projects/state';
import { useTags, useContributingCohorts } from '../shared/state';
import { useWorkingGroupById, useWorkingGroupsState } from './state';

const { workingGroups } = gp2Routing;

type CreateWorkingGroupOutputProps = {
  outputData?: gp2Model.OutputBaseResponse;
};

const CreateWorkingGroupOutput: FC<CreateWorkingGroupOutputProps> = ({
  outputData,
}) => {
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
        {...outputData}
      />
    </CreateOutputPage>
  );
};

export default CreateWorkingGroupOutput;
