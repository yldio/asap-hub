import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2, useRouteParams } from '@asap-hub/routing';
import { useAuthorSuggestions, useOutputById, useUpdateOutput } from './state';

const ShareOutput: React.FC<Record<string, never>> = () => {
  const { outputId } = useRouteParams(gp2.outputs({}).output);
  const output = useOutputById(outputId);
  const entityType = output?.workingGroups ? 'workingGroup' : 'project';
  const shareOutput = useUpdateOutput(outputId);
  const getAuthorSuggestions = useAuthorSuggestions();
  if (!output) {
    return <NotFoundPage />;
  }
  return (
    <CreateOutputPage
      entityType={entityType}
      documentType={output.documentType}
    >
      <OutputForm
        {...output}
        shareOutput={shareOutput}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </CreateOutputPage>
  );
};

export default ShareOutput;
