import {
  NotFoundPage,
  SharedResearchGrantDocument,
  SharedResearchOutput,
} from '@asap-hub/react-components';
import { sharedResearch, useRouteParams } from '@asap-hub/routing';

import { useBackHref } from '../hooks';
import { useResearchOutputById } from './state';
import Frame from '../structure/Frame';

const ResearchOutput: React.FC = () => {
  const { researchOutputId } = useRouteParams(
    sharedResearch({}).researchOutput,
  );
  const researchOutputData = useResearchOutputById(researchOutputId);
  const backHref = useBackHref() ?? sharedResearch({}).$;
  const GrantDocumentTemplateTypes = ['Proposal', 'Grant Document'];

  if (researchOutputData) {
    const researchOutputUpdatedData = {
      ...researchOutputData,
      type:
        researchOutputData.type === 'Proposal'
          ? 'Grant Document'
          : researchOutputData.type,
    };

    return (
      <Frame title={researchOutputData.title}>
        {GrantDocumentTemplateTypes.includes(researchOutputData.type) ? (
          <SharedResearchGrantDocument
            {...researchOutputUpdatedData}
            backHref={backHref}
          />
        ) : (
          <SharedResearchOutput
            {...researchOutputUpdatedData}
            backHref={backHref}
          />
        )}
      </Frame>
    );
  }
  return <NotFoundPage />;
};
export default ResearchOutput;
