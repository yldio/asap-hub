import { TeamCreateOutputPage } from '@asap-hub/react-components';
import { createResearchOutput } from '@asap-hub/fixtures';
export default {
  title: 'Templates / Team Profile / Team Create Output Page',
  component: TeamCreateOutputPage,
};

export const Normal = () => (
  <TeamCreateOutputPage
    researchOutput={createResearchOutput()}
    onCreate={() => {}}
  />
);
