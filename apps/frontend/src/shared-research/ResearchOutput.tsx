import React from 'react';
import {
  NotFoundPage,
  SharedResearchProposal,
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

  if (researchOutputData) {
    return (
      <Frame title={researchOutputData.title}>
        <SharedResearchProposal {...researchOutputData} backHref={backHref} />
      </Frame>
    );
  }
  return <NotFoundPage />;
};
export default ResearchOutput;
