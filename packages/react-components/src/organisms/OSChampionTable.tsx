import {
  OSChampionResponse,
  OSChampionSortingDirection,
  SortOSChampion,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { Card } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, neutral200, steel } from '../colors';
import { AlphabeticalSortingIcon, NumericalSortingIcon } from '../icons';
import { OSChampionRow, PageControls } from '../molecules';
import { perRem, rem, tabletScreen } from '../pixels';

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

// const rowTitleStyles = css({
//   paddingTop: `${32 / perRem}em`,
//   paddingBottom: `${16 / perRem}em`,
//   ':first-of-type': { paddingTop: 0 },
//   [`@media (min-width: ${tabletScreen.min}px)`]: { display: 'none' },
// });

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
    gridTemplateColumns: '48px 1fr 1fr',
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

// const teamNameStyles = css({
//   display: 'flex',
//   gap: rem(3),
// });

const buttonStyles = css({
  width: `${24 / perRem}em`,
  margin: 0,
  padding: 0,
  border: 'none',
  backgroundColor: 'unset',
  cursor: 'pointer',
  alignSelf: 'center',
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

type OSChampionTableProps = ComponentProps<typeof PageControls> & {
  data: OSChampionResponse[];
  sort: SortOSChampion;
  setSort: React.Dispatch<React.SetStateAction<SortOSChampion>>;
  sortingDirection: OSChampionSortingDirection;
  setSortingDirection: React.Dispatch<
    React.SetStateAction<OSChampionSortingDirection>
  >;
};

const OSChampionTable: React.FC<OSChampionTableProps> = ({
  data,
  sort,
  sortingDirection,
  ...pageControlProps
}) => {
  const iconDescription = 'Open Science Champion';
  const isTeamSortActive = sort.includes('team');
  const isNumberOSChampionAwardsSortActive =
    sort.includes('os-champion-awards');
  return (
    <>
      <Card padding={false}>
        <div css={container}>
          <div css={[rowStyles, gridTitleStyles]}>
            <span css={titleStyles}></span>
            <span css={titleStyles}>
              Team
              <button
                css={buttonStyles}
                // onClick={() => {}}
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
                // onClick={() => {}}
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
            <OSChampionRow rowItem={row} key={row.teamId} />
          ))}
        </div>
      </Card>
      <section css={pageControlsStyles}>
        <PageControls {...pageControlProps} />
      </section>
    </>
  );
};

export default OSChampionTable;
