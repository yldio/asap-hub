import { CreateOutputPage } from '@asap-hub/gp2-components';
import { gp2, useRouteParams } from '@asap-hub/routing';

const { workingGroups } = gp2;

const CreateWorkingGroupOutput = () => {
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);
  const { outputDocumentType } = useRouteParams(
    workingGroups({}).workingGroup({ workingGroupId }).createOutput,
  );

  return (
    <CreateOutputPage
      documentType={outputDocumentType}
      entityType="workingGroup"
    />
  );
};

export default CreateWorkingGroupOutput;
