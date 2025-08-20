import { OSChampionResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';

import { Button, Link } from '../atoms';
import { borderRadius } from '../card';
import { neutral200, steel } from '../colors';
import {
  plusRectIcon,
  minusRectIcon,
  InactiveBadgeIcon,
  nestedRowIcon,
} from '../icons';
import { rem } from '../pixels';

// const rowStyles = css({
//   display: 'grid',
//   padding: `${rem(20)} ${rem(24)} 0`,
//   borderBottom: `1px solid ${steel.rgb}`,
//   ':nth-of-type(2n+3)': {
//     background: neutral200.rgb,
//   },
//   ':last-child': {
//     borderBottom: 'none',
//     marginBottom: 0,
//     borderRadius: rem(borderRadius),
//   },
//   [`@media (min-width: ${tabletScreen.min}px)`]: {
//     columnGap: rem(15),
//     paddingTop: 0,
//     paddingBottom: rem(15),
//     borderBottom: `1px solid ${steel.rgb}`,
//   },
// });

const rowStyles = (isEvenRow: boolean) =>
  css({
    padding: `${rem(20)} ${rem(24)} 0`,
    borderBottom: `1px solid ${steel.rgb}`,
    borderTop: `1px solid ${steel.rgb}`,
    ':first-of-type': {
      borderBottom: 'none',
    },
    background: isEvenRow ? '#fff' : neutral200.rgb,
    //   ':nth-of-type(even) td': {
    //     background: neutral200.rgb,
    //   },
    //   ':nth-of-type(odd) td': {
    //     background: '#fff',
    //   },
    td: {
      borderBottom: `1px solid ${steel.rgb}`,
    },
    ':last-child': {
      borderBottom: 'none',
      marginBottom: 0,
      borderRadius: rem(borderRadius),
      td: {
        paddingBottom: rem(16),
      },
    },
    paddingTop: 0,
    paddingBottom: 0,
  });

const collapsedRowStyles = (isEvenRow: boolean) =>
  css({
    'td:nth-of-type(2), td:nth-of-type(3)': {
      borderBottom: `1px solid ${steel.rgb}`,
    },
    ':last-of-type': {
      td: {
        borderBottom: 'none',
      },
    },
    // ':last-child': {
    //   borderBottom: 'none',
    // },
    background: isEvenRow ? '#fff' : neutral200.rgb,

    //   padding: `${rem(20)} ${rem(24)} 0`,
    //   borderBottom: `1px solid ${steel.rgb}`,
    //   ':first-of-type': {
    //     borderBottom: 'none',
    //   },
    //   ':nth-of-type(even) td': {
    //     background: neutral200.rgb,
    //   },
    //   ':nth-of-type(odd) td': {
    //     background: '#fff',
    //   },
    //   ':last-child': {
    //     borderBottom: 'none',
    //     marginBottom: 0,
    //     borderRadius: rem(borderRadius),
    //     td: {
    //       paddingBottom: rem(16),
    //     },
    //   },
    //   paddingTop: 0,
    //   paddingBottom: 0,
  });
const teamLinkStyles = css({
  display: 'inline-block',
  width: 'fit-content',
  maxWidth: '100%',
  overflowWrap: 'break-word',
  whiteSpace: 'normal',
});

const iconStyles = css({
  display: 'flex',
  gap: rem(3),
  flex: 1,
  minWidth: 0,
  maxWidth: '100%',
});

interface OSChampionTableRowProps {
  rowItem: OSChampionResponse;
  isEvenRow: boolean;
}
const OSChampionTableRow: React.FC<OSChampionTableRowProps> = ({
  rowItem,
  isEvenRow,
}) => {
  const [expanded, setExpanded] = useState(false);
  const canExpand = !!rowItem.users.length;

  return (
    <>
      <tr
        key={rowItem.teamId}
        css={rowStyles(isEvenRow)}
        data-testid="os-champion-table-row"
      >
        <td>
          {canExpand && (
            <Button linkStyle onClick={() => setExpanded(!expanded)}>
              <span>{expanded ? minusRectIcon : plusRectIcon}</span>
            </Button>
          )}
        </td>
        <td className={'team'}>
          {/* <p css={teamLinkStyles}>
            <Link
              href={
                network({}).teams({}).team({ teamId: team.id }).workspace({}).$
              }
            >
              {team.displayName}
            </Link>
          </p> */}
          {/* <div css={{ placeSelf: 'center' }}>
            {canExpand && (
              <Button linkStyle onClick={() => setExpanded(!expanded)}>
                <span>{expanded ? minusRectIcon : plusRectIcon}</span>
              </Button>
            )}
          </div> */}

          <p css={iconStyles}>
            <span css={teamLinkStyles}>
              <Link
                href={network({}).teams({}).team({ teamId: rowItem.teamId }).$}
              >
                {rowItem.teamName}
              </Link>
            </span>
            {rowItem.isTeamInactive && <InactiveBadgeIcon />}
          </p>
        </td>
        <td>
          <p>{rowItem.teamAwardsCount}</p>
        </td>
        <td></td>
      </tr>
      {rowItem.users.length > 0 &&
        expanded &&
        rowItem.users.map((user) => (
          <tr key={user.id} css={collapsedRowStyles(isEvenRow)}>
            <td></td>
            <td className={'collapsed'}>
              <span
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: rem(8),
                }}
              >
                {nestedRowIcon}
                <p>
                  <Link
                    href={network({}).users({}).user({ userId: user.id }).$}
                  >
                    {user.name}
                  </Link>
                </p>
              </span>
            </td>
            <td>{user.awardsCount}</td>
            <td></td>
            {/* <div>
              <p css={iconStyles}>
                <Link href={network({}).users({}).user({ userId: user.id }).$}>
                  {user.name}
                </Link>
              </p>
              <p>{user.awardsCount}</p>
            </div> */}
          </tr>
        ))}
    </>
  );
};

export default OSChampionTableRow;
