import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { useAuthorSuggestions, useCreateOutput } from '../outputs/state';
import { documentTypeMapper } from '../projects/CreateProjectOutput';

const { workingGroups } = gp2Routing;

const CreateWorkingGroupOutput = () => {
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);

  const { outputDocumentType } = useRouteParams(
    workingGroups({}).workingGroup({ workingGroupId }).createOutput,
  );
  const createOutput = useCreateOutput();
  const getAuthorSuggestions = useAuthorSuggestions();
  return (
    <CreateOutputPage
      documentType={documentTypeMapper[outputDocumentType]}
      entityType="workingGroup"
    >
      <OutputForm
        shareOutput={async (payload: gp2Model.OutputPostRequest) =>
          createOutput({
            ...payload,
            workingGroups: [workingGroupId],
            projects: undefined,
          })
        }
        documentType={documentTypeMapper[outputDocumentType]}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </CreateOutputPage>
  );
};

export default CreateWorkingGroupOutput;
