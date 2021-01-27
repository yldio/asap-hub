import React from 'react';
import css from '@emotion/css';

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
  readonly teams: ReadonlyArray<{ displayName: string; href: string }>;
}
const TeamsList: React.FC<TeamsListProps> = ({ teams }) => (
  <ul css={listStyles}>
    {teams.flatMap(({ displayName, href }, i) => (
      <li key={`sep-${i}`}>
        {i > 0 && <Divider />}
        <div css={rowStyles}>
          {teamIcon}
          <Link href={href}>{displayName}</Link>
        </div>
      </li>
    ))}
  </ul>
);

export default TeamsList;
