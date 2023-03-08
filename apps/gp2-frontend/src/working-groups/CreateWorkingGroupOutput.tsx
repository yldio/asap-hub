import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { useCreateOutput } from '../outputs/state';

const { workingGroups } = gp2Routing;

const CreateWorkingGroupOutput = () => {
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);

  const { outputDocumentType } = useRouteParams(
    workingGroups({}).workingGroup({ workingGroupId }).createOutput,
  );
  const createOutput = useCreateOutput();

  return (
    <CreateOutputPage
      documentType={outputDocumentType}
      entityType="workingGroup"
    >
      <OutputForm
        createOutput={async (payload: gp2Model.OutputPostRequest) =>
          createOutput({
            ...payload,
            workingGroups: [workingGroupId],
            projects: undefined,
          })
        }
        documentType={outputDocumentType}
      />
    </CreateOutputPage>
  );
};

export default CreateWorkingGroupOutput;
