import { OSChampionResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';

import { Button, Link } from '../atoms';
import { borderRadius } from '../card';
import { neutral200, steel } from '../colors';
import { plusRectIcon, minusRectIcon, InactiveBadgeIcon } from '../icons';
import { rem, tabletScreen } from '../pixels';

const rowStyles = css({
  display: 'grid',
  padding: `${rem(20)} ${rem(24)} 0`,
  borderBottom: `1px solid ${steel.rgb}`,
  ':nth-of-type(2n+3)': {
    background: neutral200.rgb,
  },
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    borderRadius: rem(borderRadius),
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    columnGap: rem(15),
    paddingTop: 0,
    paddingBottom: rem(15),
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const rowValueStyles = css({
  display: 'flex',
  gap: rem(6),
  fontWeight: 400,
});

const iconStyles = css({
  display: 'flex',
  gap: rem(3),
});

const columnsStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '48px 1fr 1fr',
  },
});

const collapsedRowStyles = css({
  display: 'grid',
  margin: `0 ${rem(24)} 0 ${rem(85)}`,
  borderBottom: `1px solid ${steel.rgb}`,
  ':last-child': {
    borderBottom: 'none',
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    paddingTop: 0,
    paddingBottom: rem(15),
    borderBottom: `1px solid ${steel.rgb}`,
    gridTemplateColumns: '1fr 1fr',
    columnGap: rem(15),
  },
});

const rowContainerStyles = css({
  display: 'grid',
  borderBottom: `1px solid ${steel.rgb}`,
  ':first-of-type': {
    borderBottom: 'none',
  },
  ':nth-of-type(2n+3)': {
    background: neutral200.rgb,
  },
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: rem(15),
    borderRadius: rem(borderRadius),
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

interface OSChampionRowProps {
  rowItem: OSChampionResponse;
}
const OSChampionRow: React.FC<OSChampionRowProps> = ({ rowItem }) => {
  const [expanded, setExpanded] = useState(false);
  const canExpand = !!rowItem.users.length;

  return (
    <div css={[rowContainerStyles]}>
      <div css={[rowStyles, columnsStyles]}>
        <div css={{ placeSelf: 'center' }}>
          {canExpand && (
            <Button linkStyle onClick={() => setExpanded(!expanded)}>
              <span>{expanded ? minusRectIcon : plusRectIcon}</span>
            </Button>
          )}
        </div>

        <p css={iconStyles}>
          <Link href={network({}).teams({}).team({ teamId: rowItem.teamId }).$}>
            {rowItem.teamName}
          </Link>
          {rowItem.isTeamInactive && <InactiveBadgeIcon />}
        </p>
        <p css={rowValueStyles}>{rowItem.teamAwardsCount}</p>
      </div>
      {rowItem.users.length > 0 &&
        expanded &&
        rowItem.users.map((user) => (
          <div key={user.id} css={[collapsedRowStyles]}>
            <p css={iconStyles}>
              <Link href={network({}).users({}).user({ userId: user.id }).$}>
                {user.name}
              </Link>
            </p>
            <p>{user.awardsCount}</p>
          </div>
        ))}
    </div>
  );
};

export default OSChampionRow;
