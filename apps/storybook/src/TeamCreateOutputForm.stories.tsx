import { TeamCreateOutputForm } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Organisms / Team Profile / Team Create Output Form',
  component: TeamCreateOutputForm,
};

export const Normal = () => (
  <StaticRouter>
    <TeamCreateOutputForm tagSuggestions={['A53T', 'Activity assay']} />
  </StaticRouter>
);
