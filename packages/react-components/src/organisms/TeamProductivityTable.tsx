import { TeamProductivityResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { PageControls } from '..';

import { Card } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, neutral200, steel } from '../colors';
import { InactiveBadgeIcon } from '../icons';
import { rem, tabletScreen } from '../pixels';

const container = css({
  display: 'grid',
  paddingTop: rem(32),
});

const gridTitleStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'inherit',
    paddingBottom: rem(16),
  },
});

const rowTitleStyles = css({
  paddingTop: rem(32),
  paddingBottom: rem(16),
  ':first-of-type': { paddingTop: 0 },
  [`@media (min-width: ${tabletScreen.min}px)`]: { display: 'none' },
});

const rowStyles = css({
  display: 'grid',
  padding: `${rem(20)} ${rem(24)} 0`,
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
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    columnGap: rem(15),
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });

const iconStyles = css({
  display: 'flex',
  gap: rem(3),
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

type TeamProductivityTableProps = ComponentProps<typeof PageControls> & {
  data: TeamProductivityResponse[];
};

const TeamProductivityTable: React.FC<TeamProductivityTableProps> = ({
  data,
  ...pageControlProps
}) => (
  <>
    <Card padding={false}>
      <div css={container}>
        <div css={[rowStyles, gridTitleStyles]}>
          <span css={titleStyles}>Team</span>
          <span css={titleStyles}>Articles</span>
          <span css={titleStyles}>Bioinformatics</span>
          <span css={titleStyles}>Datasets</span>
          <span css={titleStyles}>Lab Resources</span>
          <span css={titleStyles}>Protocols</span>
        </div>
        {data.map((row) => (
          <div key={row.id} css={[rowStyles]}>
            <span css={[titleStyles, rowTitleStyles]}>Team</span>
            <p css={iconStyles}>
              {row.name} {row.isInactive && <InactiveBadgeIcon />}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>Articles</span>
            <p>{row.Article}</p>
            <span css={[titleStyles, rowTitleStyles]}>Bioinformatics</span>
            <p>{row.Bioinformatics}</p>
            <span css={[titleStyles, rowTitleStyles]}>Datasets</span>
            <p>{row.Dataset}</p>
            <span css={[titleStyles, rowTitleStyles]}>Lab Resources</span>
            <p>{row['Lab Resource']}</p>
            <span css={[titleStyles, rowTitleStyles]}>Protocols</span>
            <p>{row.Protocol}</p>
          </div>
        ))}
      </div>
    </Card>
    <section css={pageControlsStyles}>
      <PageControls {...pageControlProps} />
    </section>
  </>
);

export default TeamProductivityTable;
