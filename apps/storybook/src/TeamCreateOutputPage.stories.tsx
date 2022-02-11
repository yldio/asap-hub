import { TeamCreateOutputPage } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / Team Profile / Team Create Output Page',
  component: TeamCreateOutputPage,
};

export const Normal = () => (
  <StaticRouter>
    <TeamCreateOutputPage
      tagSuggestions={['A53T', 'Activity assay']}
      type="Article"
    />
  </StaticRouter>
);
