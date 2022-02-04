import { TeamCreateOutputPage } from '@asap-hub/react-components';

export default {
  title: 'Templates / Team Profile / Team Create Output Page',
  component: TeamCreateOutputPage,
};

export const Normal = () => (
  <TeamCreateOutputPage
    tagSuggestions={['A53T', 'Activity assay']}
    type="Article"
  />
);
