import { css } from '@emotion/react';
import { Card } from '../atoms';
import { charcoal, neutral200, steel } from '../colors';
import { perRem, tabletScreen } from '../pixels';
import { borderRadius } from '../card';

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
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    columnGap: `${15 / perRem}em`,
    paddingTop: `${0 / perRem}em`,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });

export type TeamProductivityMetric = {
  id: string;
  name: string;
  articles: number;
  bioinformatics: number;
  datasets: number;
  labResources: number;
  protocols: number;
};
interface TeamProductivityTableProps {
  data: TeamProductivityMetric[];
}

const TeamProductivityTable: React.FC<TeamProductivityTableProps> = ({
  data,
}) => (
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
          <p>{row.name}</p>
          <span css={[titleStyles, rowTitleStyles]}>Articles</span>
          <p>{row.articles}</p>
          <span css={[titleStyles, rowTitleStyles]}>Bioinformatics</span>
          <p>{row.bioinformatics}</p>
          <span css={[titleStyles, rowTitleStyles]}>Datasets</span>
          <p>{row.datasets}</p>
          <span css={[titleStyles, rowTitleStyles]}>Lab Resources</span>
          <p>{row.labResources}</p>
          <span css={[titleStyles, rowTitleStyles]}>Protocols</span>
          <p>{row.protocols}</p>
        </div>
      ))}
    </div>
  </Card>
);

export default TeamProductivityTable;
