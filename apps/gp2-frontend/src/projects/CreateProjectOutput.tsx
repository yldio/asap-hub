import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { gp2 as gp2Model } from '@asap-hub/model';
import { FC } from 'react';
import { useAuthorSuggestions, useCreateOutput } from '../outputs/state';

const { projects } = gp2Routing;

export const documentTypeMapper: Record<
  gp2Routing.OutputDocumentTypeParameter,
  gp2Model.OutputDocumentType
> = {
  article: 'Article',
  'code-software': 'Code/Software',
  'data-release': 'Data Release',
  'procedural-form': 'Procedural Form',
  'training-materials': 'Training Materials',
  update: 'Update',
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
            workingGroups: undefined,
            projects: [projectId],
          })
        }
        documentType={documentTypeMapper[outputDocumentType]}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </CreateOutputPage>
  );
};

export default CreateProjectOutput;
