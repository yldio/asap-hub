import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { FC } from 'react';
import { useAuthorSuggestions, useCreateOutput } from '../outputs/state';
import { documentTypeMapper } from '../projects/CreateProjectOutput';
import { useKeywords } from '../shared/state';

const { workingGroups } = gp2Routing;

const CreateWorkingGroupOutput: FC<Record<string, never>> = () => {
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);

  const { outputDocumentType } = useRouteParams(
    workingGroups({}).workingGroup({ workingGroupId }).createOutput,
  );
  const createOutput = useCreateOutput();
  const getAuthorSuggestions = useAuthorSuggestions();
  const { items: suggestions } = useKeywords();
  return (
    <CreateOutputPage
      documentType={documentTypeMapper[outputDocumentType]}
      entityType="workingGroup"
    >
      <OutputForm
        entityType="workingGroup"
        shareOutput={async (payload: gp2Model.OutputPostRequest) =>
          createOutput({
            ...payload,
            workingGroupId,
            projectId: undefined,
          })
        }
        documentType={documentTypeMapper[outputDocumentType]}
        getAuthorSuggestions={getAuthorSuggestions}
        suggestions={suggestions}
      />
    </CreateOutputPage>
  );
};

export default CreateWorkingGroupOutput;
