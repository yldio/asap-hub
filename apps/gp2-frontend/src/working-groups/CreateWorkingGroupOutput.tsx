import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { gp2, useRouteParams } from '@asap-hub/routing';
import { useCreateOutput } from '../outputs/state';

const { workingGroups } = gp2;

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
        createOutput={createOutput}
        documentType={outputDocumentType}
      />
    </CreateOutputPage>
  );
};

export default CreateWorkingGroupOutput;
