import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { FC } from 'react';
import { useAuthorSuggestions, useCreateOutput } from '../outputs/state';

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
  const getAuthorSuggestions = useAuthorSuggestions();
  return (
    <CreateOutputPage
      documentType={documentTypeMapper[outputDocumentType]}
      entityType="project"
    >
      <OutputForm
        entityType="project"
        shareOutput={async (payload: gp2Model.OutputPostRequest) =>
          createOutput({
            ...payload,
            workingGroup: undefined,
            project: projectId,
          })
        }
        documentType={documentTypeMapper[outputDocumentType]}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </CreateOutputPage>
  );
};

export default CreateProjectOutput;
