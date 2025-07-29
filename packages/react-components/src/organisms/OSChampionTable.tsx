import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { Card, Link } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, neutral200, steel } from '../colors';
import { AlphabeticalSortingIcon, NumericalSortingIcon } from '../icons';
import { perRem, tabletScreen } from '../pixels';
import LeadershipPageBody from '../templates/AnalyticsLeadershipPageBody';

const container = css({
  display: 'grid',
  paddingTop: `${32 / perRem}em`,
});

const gridTitleStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'inherit',
    paddingBottom: `${16 / perRem}em`,
  },
});

const rowTitleStyles = css({
  paddingTop: `${32 / perRem}em`,
  paddingBottom: `${16 / perRem}em`,
  ':first-of-type': { paddingTop: 0 },
  [`@media (min-width: ${tabletScreen.min}px)`]: { display: 'none' },
});

const rowStyles = css({
  display: 'grid',
  padding: `${20 / perRem}em ${24 / perRem}em 0`,
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
    paddingBottom: `${15 / perRem}em`,
    borderRadius: `${borderRadius / perRem}em`,
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '1fr 1fr',
    columnGap: `${15 / perRem}em`,
    paddingTop: `${0 / perRem}em`,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  color: charcoal.rgb,
  gap: `${8 / perRem}em`,
});

const teamNameStyles = css({
  display: 'flex',
  gap: `${3 / perRem}em`,
});

const buttonStyles = css({
  width: `${24 / perRem}em`,
  margin: 0,
  padding: 0,
  border: 'none',
  backgroundColor: 'unset',
  cursor: 'pointer',
  alignSelf: 'center',
});

export type TeamMetric = {
  id: string;
  name: string;
  memberCount: number;
};
type OSChampionTableProps = Pick<
  ComponentProps<typeof LeadershipPageBody>,
  'data' | 'sort' | 'setSort' | 'sortingDirection' | 'setSortingDirection'
>;

const OSChampionTable: React.FC<OSChampionTableProps> = ({
  data,
  sort,
  sortingDirection,
}) => {
  const iconDescription = 'Open Science Champion';
  const isTeamSortActive = sort.includes('team');
  const isNumberOSChampionAwardsSortActive =
    sort.includes('os-champion-awards');
  return (
    <Card padding={false}>
      <div css={container}>
        <div css={[rowStyles, gridTitleStyles]}>
          <span css={titleStyles}>
            Team
            <button
              css={buttonStyles}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onClick={() => {}}
            >
              <AlphabeticalSortingIcon
                active={isTeamSortActive}
                ascending={sortingDirection.team === 'asc'}
              />
            </button>
          </span>

          <span css={titleStyles}>
            Total number of Open Science Champion awards
            <button
              css={buttonStyles}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onClick={() => {}}
            >
              <NumericalSortingIcon
                active={isNumberOSChampionAwardsSortActive}
                ascending={sortingDirection.osChampionAwards === 'asc'}
                description={`${iconDescription} OS Champion Awards`}
              />
            </button>
          </span>
        </div>
        {data.map((row) => (
          <div key={row.id} css={[rowStyles]}>
            <span css={[titleStyles, rowTitleStyles]}>Team</span>
            <p css={teamNameStyles}>
              <Link href={network({}).teams({}).team({ teamId: row.id }).$}>
                {row.name}
              </Link>
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OSChampionTable;
