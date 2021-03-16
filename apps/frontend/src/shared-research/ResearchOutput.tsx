import React from 'react';
import {
  ResearchOutputPage,
  NotFoundPage,
  Loading,
} from '@asap-hub/react-components';
import { sharedResearch, useRouteParams } from '@asap-hub/routing';

import { useBackHref } from '../hooks';
import { useResearchOutputById } from '../api';

const ResearchOutput: React.FC = () => {
  const { researchOutputId } = useRouteParams(
    sharedResearch({}).researchOutput,
  );
  const { loading, data: researchOutputData } = useResearchOutputById(
    researchOutputId,
  );

  const backHref = useBackHref() ?? sharedResearch({}).$;

  if (loading) {
    return <Loading />;
  }

  if (researchOutputData) {
    return <ResearchOutputPage {...researchOutputData} backHref={backHref} />;
  }

  return <NotFoundPage />;
};
export default ResearchOutput;
