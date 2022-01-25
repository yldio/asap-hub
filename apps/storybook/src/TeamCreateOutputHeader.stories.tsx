import { TeamCreateOutputHeader } from '@asap-hub/react-components';
import { createResearchOutput } from '@asap-hub/fixtures';

export default {
  title: 'Organisms / Team Profile / Team Create Output Header',
  component: TeamCreateOutputHeader,
};

export const Normal = () => (
  <TeamCreateOutputHeader researchOutput={createResearchOutput()} />
);
