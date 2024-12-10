import {
  ComplianceSortingDirection,
  manuscriptStatus,
  PartialManuscriptResponse,
  SortCompliance,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { article, PageControls } from '..';
import { Card, Headline3, Paragraph, Tag } from '../atoms';
import { ComplianceTable } from '../organisms';
import { rem } from '../pixels';

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

const iconStyles = css({
  display: 'inline-flex',
  svg: {
    width: rem(48),
    height: rem(48),
    path: {
      fill: '#00202C',
    },
  },
});

const cardStyles = css({
  marginTop: rem(32),
});

const statusDescriptionStyles = css({
  fontWeight: 'bold',
  marginBottom: rem(16),
});

const manuscriptStatusContainerStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '16px',
  justifyItems: 'start',
});

type ComplianceDashboardProps = ComponentProps<typeof PageControls> & {
  data: PartialManuscriptResponse[];
  sort: SortCompliance;
  setSort: React.Dispatch<React.SetStateAction<SortCompliance>>;
  sortingDirection: ComplianceSortingDirection;
  setSortingDirection: React.Dispatch<
    React.SetStateAction<ComplianceSortingDirection>
  >;
};

const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({
  data,
  sort,
  sortingDirection,
  setSort,
  setSortingDirection,
  ...pageControlsProps
}) => (
  <article>
    <Card overrideStyles={cardStyles}>
      <div css={statusDescriptionStyles}>
        <Paragraph>Manuscripts by status:</Paragraph>
      </div>
      <div css={manuscriptStatusContainerStyles}>
        {manuscriptStatus.map((status, index) => (
          <Tag key={index}>{status}</Tag>
        ))}
      </div>
    </Card>
    {data.length > 0 ? (
      <main css={{ paddingTop: rem(32) }}>
        <ComplianceTable
          data={data}
          sort={sort}
          sortingDirection={sortingDirection}
          setSort={setSort}
          setSortingDirection={setSortingDirection}
        />
        <section css={pageControlsStyles}>
          <PageControls {...pageControlsProps} />
        </section>
      </main>
    ) : (
      <main css={{ textAlign: 'center', paddingTop: rem(48) }}>
        <span css={iconStyles}>{article}</span>
        <Headline3>No manuscripts available.</Headline3>
        <Paragraph accent="lead">
          When a team shares a manuscript for a compliance review, it will be
          listed here.
        </Paragraph>
      </main>
    )}
  </article>
);

export default ComplianceDashboard;
