import {
  ComplianceSortingDirection,
  ManuscriptPutRequest,
  ManuscriptResponse,
  PartialManuscriptResponse,
  SortCompliance,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { Card } from '../atoms';
import { borderRadius } from '../card';
import { charcoal, neutral200, steel } from '../colors';
import { rem, tabletScreen } from '../pixels';
import ComplianceTableRow from './ComplianceTableRow';

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
    gridTemplateColumns: '0.5fr 0.7fr 0.7fr 1fr 0.5fr 1fr',
    columnGap: rem(15),
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const titleStyles = css({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  color: charcoal.rgb,
  gap: rem(8),
});

type ComplianceTableProps = {
  data: PartialManuscriptResponse[];
  sort?: SortCompliance;
  setSort?: React.Dispatch<React.SetStateAction<SortCompliance>>;
  sortingDirection?: ComplianceSortingDirection;
  setSortingDirection?: React.Dispatch<
    React.SetStateAction<ComplianceSortingDirection>
  >;
  onUpdateManuscript: (
    manuscriptId: string,
    payload: ManuscriptPutRequest,
  ) => Promise<ManuscriptResponse>;
};

const ComplianceTable: React.FC<ComplianceTableProps> = ({
  onUpdateManuscript,
  data,
}) => {
  return (
    <Card>
      <div css={container}>
        <div css={[rowStyles, gridTitleStyles]}>
          <span css={titleStyles}>Team</span>
          <span css={titleStyles}>ID</span>
          <span css={titleStyles}>Last Updated</span>
          <span css={titleStyles}>Status</span>
          <span css={titleStyles}>APC Coverage</span>
          <span css={titleStyles}>Assigned Users</span>
        </div>
        {data.map((row) => (
          <ComplianceTableRow
            key={row.id}
            data={row}
            onUpdateManuscript={onUpdateManuscript}
          />
        ))}
      </div>
    </Card>
  );
};

export default ComplianceTable;
