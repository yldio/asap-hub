import { CreateOutputPage } from '@asap-hub/gp2-components';
import { gp2, useRouteParams } from '@asap-hub/routing';

const { projects } = gp2;

const CreateProjectOutput = () => {
  const { projectId } = useRouteParams(projects({}).project);
  const { outputDocumentType } = useRouteParams(
    projects({}).project({ projectId }).createOutput,
  );

  return (
    <CreateOutputPage documentType={outputDocumentType} entityType="project" />
  );
};

export default CreateProjectOutput;
