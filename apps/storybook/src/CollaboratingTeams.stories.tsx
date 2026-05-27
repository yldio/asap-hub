import { CollaboratingTeams } from '@asap-hub/react-components';
import { CollaboratingTeam, TeamType } from '@asap-hub/model';
import { StaticRouter } from 'react-router';

import { number } from './knobs';

export default {
  title: 'Molecules / Collaborating Teams',
  component: CollaboratingTeams,
};

const makeArticles = (
  count: number,
  prefix: string,
): CollaboratingTeam['articles'] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-article-${i}`,
    title: `Research output ${i + 1} from ${prefix}`,
    type: i % 2 === 0 ? 'Preprint' : 'Published',
  }));

const makeTeams = (count: number): CollaboratingTeam[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `team-${i}`,
    displayName: `Collaborating Team ${i + 1}`,
    teamType: (i % 2 === 0 ? 'Discovery Team' : 'Resource Team') as TeamType,
    inactiveSince: i === 2 ? '2023-01-01' : undefined,
    articles: makeArticles((i % 9) + 1, `team-${i}`),
  }));

export const Normal = () => (
  <StaticRouter location="/">
    <CollaboratingTeams collaboratingTeams={makeTeams(number('Teams', 4))} />
  </StaticRouter>
);

export const Empty = () => (
  <StaticRouter location="/">
    <CollaboratingTeams collaboratingTeams={[]} />
  </StaticRouter>
);

export const WithViewMore = () => (
  <StaticRouter location="/">
    <CollaboratingTeams collaboratingTeams={makeTeams(number('Teams', 14))} />
  </StaticRouter>
);

export const WithScrollableArticles = () => (
  <StaticRouter location="/">
    <CollaboratingTeams
      collaboratingTeams={[
        {
          id: 'team-many-articles',
          displayName: 'Team With Many Articles',
          teamType: 'Discovery Team',
          articles: makeArticles(12, 'many'),
        },
      ]}
    />
  </StaticRouter>
);
