import React from 'react';
import css from '@emotion/css';
import { network } from '@asap-hub/routing';

import { Divider, Link } from '../atoms';
import { perRem } from '../pixels';
import { teamIcon } from '../icons';

const listStyles = css({
  display: 'grid',
  listStyle: 'none',
  margin: 0,
  padding: 0,
});
const rowStyles = css({
  padding: `${12 / perRem}em 0`,

  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  gridColumnGap: `${12 / perRem}em`,
  alignItems: 'center',
});

interface TeamsListProps {
  readonly teams: ReadonlyArray<{ id: string; displayName: string }>;
}
const TeamsList: React.FC<TeamsListProps> = ({ teams }) => (
  <ul css={listStyles}>
    {teams.flatMap(({ id, displayName }, i) => (
      <li key={`sep-${i}`}>
        {i > 0 && <Divider />}
        <div css={rowStyles}>
          {teamIcon}
          <Link href={network({}).teams({}).team({ teamId: id }).$}>
            Team {displayName}
          </Link>
        </div>
      </li>
    ))}
  </ul>
);

export default TeamsList;
