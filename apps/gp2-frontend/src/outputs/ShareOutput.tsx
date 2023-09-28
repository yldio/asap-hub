import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2, useRouteParams } from '@asap-hub/routing';
import { useKeywords } from '../shared/state';

import { useAuthorSuggestions, useOutputById, useUpdateOutput } from './state';

const ShareOutput: React.FC<Record<string, never>> = () => {
  const { outputId } = useRouteParams(gp2.outputs({}).output);
  const output = useOutputById(outputId);
  const entityType = output?.workingGroup ? 'workingGroup' : 'project';
  const shareOutput = useUpdateOutput(outputId);
  const getAuthorSuggestions = useAuthorSuggestions();
  const { items: suggestions } = useKeywords();

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
        entityType={entityType}
        shareOutput={shareOutput}
        getAuthorSuggestions={getAuthorSuggestions}
        keywordSuggestions={suggestions}
      />
    </CreateOutputPage>
  );
};

export default ShareOutput;
