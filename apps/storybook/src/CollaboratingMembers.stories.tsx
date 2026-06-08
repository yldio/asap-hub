import { CollaboratingMembers } from '@asap-hub/react-components';
import { CollaboratingMember } from '@asap-hub/model';
import { StaticRouter } from 'react-router';

import { number } from './knobs';

export default {
  title: 'Molecules / Collaborating Members',
  component: CollaboratingMembers,
};

const makeArticles = (
  count: number,
  prefix: string,
): CollaboratingMember['articles'] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-article-${i}`,
    title: `Research output ${i + 1} from ${prefix}`,
    type: i % 2 === 0 ? 'Preprint' : 'Published',
  }));

const makeMembers = (count: number): CollaboratingMember[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `user-${i}`,
    displayName: `Collaborating User ${i + 1}`,
    alumniSinceDate: i === 2 ? '2024-01-01' : undefined,
    teams:
      i % 3 === 0
        ? [
            { id: `team-a-${i}`, displayName: `Team Alpha ${i}` },
            { id: `team-b-${i}`, displayName: `Team Beta ${i}` },
          ]
        : [{ id: `team-${i}`, displayName: `Team ${i + 1}` }],
    avatarUrl: undefined,
    articles: makeArticles((i % 9) + 1, `user-${i}`),
  }));

export const Normal = () => (
  <StaticRouter location="/">
    <CollaboratingMembers
      collaboratingMembers={makeMembers(number('Members', 4))}
    />
  </StaticRouter>
);

export const Empty = () => (
  <StaticRouter location="/">
    <CollaboratingMembers collaboratingMembers={[]} />
  </StaticRouter>
);

export const WithViewMore = () => (
  <StaticRouter location="/">
    <CollaboratingMembers
      collaboratingMembers={makeMembers(number('Members', 12))}
    />
  </StaticRouter>
);

export const WithScrollableArticles = () => (
  <StaticRouter location="/">
    <CollaboratingMembers
      collaboratingMembers={[
        {
          id: 'user-many-articles',
          displayName: 'Researcher With Many Articles',
          alumniSinceDate: undefined,
          teams: [{ id: 'team-1', displayName: 'Team Alpha' }],
          articles: makeArticles(12, 'many'),
        },
      ]}
    />
  </StaticRouter>
);
