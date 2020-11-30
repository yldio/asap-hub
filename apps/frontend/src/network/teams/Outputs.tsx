import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { join } from 'path';
import { TeamProfileOutputs } from '@asap-hub/react-components';
import { TeamResponse } from '@asap-hub/model';

import { SHARED_RESEARCH_PATH } from '../../routes';

interface OutputsProps {
  readonly outputs: TeamResponse['outputs'];
}
const Outputs: React.FC<OutputsProps> = ({ outputs }) => {
  const { url } = useRouteMatch();

  const outputsProps = outputs.map((output) => ({
    ...output,
    team: output.team && {
      ...output.team,
      href: join(url, '..'),
    },
    href: join(SHARED_RESEARCH_PATH, output.id),
  }));

  return <TeamProfileOutputs outputs={outputsProps} />;
};

export default Outputs;
