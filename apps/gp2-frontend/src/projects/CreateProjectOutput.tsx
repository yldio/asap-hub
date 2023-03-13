import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { gp2 as gp2Model } from '@asap-hub/model';
import { useAuthorSuggestions, useCreateOutput } from '../outputs/state';

const { projects } = gp2Routing;

const CreateProjectOutput = () => {
  const { projectId } = useRouteParams(projects({}).project);
  const { outputDocumentType } = useRouteParams(
    projects({}).project({ projectId }).createOutput,
  );
  const createOutput = useCreateOutput();
  const getAuthorSuggestions = useAuthorSuggestions();
  return (
    <CreateOutputPage documentType={outputDocumentType} entityType="project">
      <OutputForm
        createOutput={async (payload: gp2Model.OutputPostRequest) =>
          createOutput({
            ...payload,
            workingGroups: undefined,
            projects: [projectId],
          })
        }
        documentType={outputDocumentType}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </CreateOutputPage>
  );
};

export default CreateProjectOutput;
