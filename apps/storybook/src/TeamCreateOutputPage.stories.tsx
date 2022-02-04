import { TeamCreateOutputPage } from '@asap-hub/react-components';
import { createResearchOutput } from '@asap-hub/fixtures';

export default {
  title: 'Templates / Team Profile / Team Create Output Page',
  component: TeamCreateOutputPage,
};

export const Normal = () => (
  <TeamCreateOutputPage
    suggestions={['A53T', 'Activity assay']}
    researchOutput={createResearchOutput()}
    onCreate={() => {}}
  />
);
