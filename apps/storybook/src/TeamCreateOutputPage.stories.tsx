import { createTeamResponse } from '@asap-hub/fixtures';
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
      getLabSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([{ label: 'lab name', value: '1' }]);
          }, 1000);
        })
      }
      getAuthorSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([{ label: 'user name', value: '1' }]);
          }, 1000);
        })
      }
      team={createTeamResponse()}
      getTeamSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([{ label: 'team name', value: '1' }]);
          }, 1000);
        })
      }
    />
  </StaticRouter>
);
