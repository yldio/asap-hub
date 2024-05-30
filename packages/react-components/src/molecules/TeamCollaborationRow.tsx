import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';

import { Button, Link } from '../atoms';
import { borderRadius } from '../card';
import { neutral200, steel } from '../colors';
import { plusRectIcon, minusRectIcon, InactiveBadgeIcon } from '../icons';
import { TeamCollaborationMetric } from '../organisms';
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

const iconStyles = css({
  display: 'flex',
  gap: rem(3),
});

const columnsStyles = (isWithinTeam: boolean) =>
  css({
    [`@media (min-width: ${tabletScreen.min}px)`]: {
      gridTemplateColumns: isWithinTeam
        ? '1fr 1fr 1fr 1fr 1fr 1fr'
        : '0.3fr 1fr 1fr 1fr 1fr 1fr 1fr',
    },
  });

const collapsedRowStyles = css({
  display: 'grid',
  margin: `0 ${rem(24)} 0 ${rem(75)}`,
  borderBottom: `1px solid ${steel.rgb}`,
  ':last-child': {
    borderBottom: 'none',
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    paddingTop: 0,
    paddingBottom: rem(15),
    borderBottom: `1px solid ${steel.rgb}`,
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
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

interface TeamCollaborationProps {
  rowItem: TeamCollaborationMetric;
}
const TeamCollaborationRow: React.FC<TeamCollaborationProps> = ({
  rowItem,
}) => {
  const [expanded, setExpanded] = useState(false);
  const canExpand = !!rowItem.collaborationByTeam.length;
  const isWithinTeam = rowItem.type === 'within-team';

  return (
    <div css={[rowContainerStyles]}>
      <div css={[rowStyles, columnsStyles(isWithinTeam)]}>
        {!isWithinTeam && (
          <div css={{ placeSelf: 'center' }}>
            {canExpand && (
              <Button linkStyle onClick={() => setExpanded(!expanded)}>
                <span>{expanded ? minusRectIcon : plusRectIcon}</span>
              </Button>
            )}
          </div>
        )}

        <p css={iconStyles}>
          <Link href={network({}).teams({}).team({ teamId: rowItem.id }).$}>
            {rowItem.name}
          </Link>
          {rowItem.isInactive && <InactiveBadgeIcon />}
        </p>
        <p>{rowItem.Article}</p>
        <p>{rowItem.Bioinformatics}</p>
        <p>{rowItem.Dataset}</p>
        <p>{rowItem['Lab Resource']}</p>
        <p>{rowItem.Protocol}</p>
      </div>
      {rowItem.collaborationByTeam.length > 0 &&
        expanded &&
        rowItem.collaborationByTeam.map((team) => (
          <div key={team.id} css={[collapsedRowStyles]}>
            <p css={iconStyles}>
              <Link href={network({}).teams({}).team({ teamId: team.id }).$}>
                {team.name}
              </Link>
              {team.isInactive && <InactiveBadgeIcon />}
            </p>
            <p>{team.Article}</p>
            <p>{team.Bioinformatics}</p>
            <p>{team.Dataset}</p>
            <p>{team['Lab Resource']}</p>
            <p>{team.Protocol}</p>
          </div>
        ))}
    </div>
  );
};

export default TeamCollaborationRow;
