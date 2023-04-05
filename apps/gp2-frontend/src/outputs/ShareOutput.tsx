import { CreateOutputPage, OutputForm } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2, useRouteParams } from '@asap-hub/routing';
import { ComponentProps } from 'react';
import { useAuthorSuggestions, useOutputById, useUpdateOutput } from './state';

type ShareOutputProps = Pick<
  ComponentProps<typeof OutputForm>,
  'setBannerMessage'
>;

const ShareOutput: React.FC<ShareOutputProps> = ({ setBannerMessage }) => {
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
        entityType={entityType}
        setBannerMessage={setBannerMessage}
        shareOutput={shareOutput}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </CreateOutputPage>
  );
};

export default ShareOutput;
