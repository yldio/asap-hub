import {
  ArticleItem,
  GrantType,
  Milestone as MilestoneType,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps, FC } from 'react';
import { Card, Headline3, Paragraph } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import Milestone from './Milestone';
import { neutral1000, neutral200, steel } from '../colors';
import type { ResearchOutputOption } from '../utils';
import { PageControls } from '../molecules';
import { searchIcon } from '../icons';

const WRAPPER_TOP_PADDING = 32;

const contentStyles = css({
  padding: `${rem(WRAPPER_TOP_PADDING)} ${rem(24)}`,
  paddingBottom: 0,
});

const containerStyles = css({
  display: 'grid',
  rowGap: rem(32),
});

const milestonesGridStyles = css({
  display: 'grid',
  gridTemplateColumns: '150px 1fr auto',
  columnGap: rem(24),
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    gridTemplateColumns: '1fr',
  },
});

const tableHeaderStyles = css({
  display: 'grid',
  gridColumn: '1 / -1',
  gridTemplateColumns: 'subgrid',
  marginBottom: rem(16),
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    display: 'none',
  },
});

const headerLabelStyles = css({
  fontSize: rem(17),
  fontWeight: 'bold',
  color: neutral1000.rgb,
});

const aimsHeaderStyles = css({
  flexShrink: 0,
});

const milestoneHeaderStyles = css({
  flex: 1,
  minWidth: 0,
});

const statusHeaderStyles = css({
  flexShrink: 0,
});

const milestonesListStyles = css({
  display: 'contents',
});

const milestoneRowWrapperStyles = (index: number, isLast: boolean) =>
  css({
    display: 'grid',
    gridColumn: '1 / -1',
    gridTemplateColumns: 'subgrid',
    backgroundColor: index % 2 === 0 ? '#FFFFFF' : neutral200.rgb,
    marginInline: rem(-24),
    paddingInline: rem(24),
    paddingTop: index === 0 ? 0 : rem(20),
    paddingBottom: rem(20),
    borderBottom: `1px solid ${steel.rgb}`,
    ...(isLast
      ? { paddingBottom: rem(WRAPPER_TOP_PADDING), borderBottom: 'none' }
      : {}),
  });

const noMilestonesTextStyles = css({
  fontSize: rem(17),
  lineHeight: rem(24),
  fontWeight: 700,
  color: neutral1000.rgb,
});

const pageControlsStyles = css({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: rem(16),
  paddingBottom: rem(36),
});

const noResultsStyles = css({
  display: 'grid',
  justifyItems: 'center',
  textAlign: 'center',
  rowGap: rem(16),
  svg: {
    width: rem(48),
    height: rem(48),
    stroke: neutral1000.rgb,
  },
});

const noResultsIconStyles = css({
  display: 'inline-flex',
  svg: {
    width: rem(48),
    height: rem(48),
  },
});

type ProjectMilestonesProps = {
  readonly milestones: ReadonlyArray<MilestoneType>;
  readonly total: number;
  readonly hasAppliedSearch: boolean;
  readonly pageControlsProps: ComponentProps<typeof PageControls>;
  readonly isLead: boolean;
  readonly loadArticleOptions: (
    inputValue: string,
  ) => Promise<ResearchOutputOption[]>;
  readonly fetchLinkedArticles: (
    milestoneId: string,
  ) => Promise<ReadonlyArray<ArticleItem>>;
  readonly selectedGrantType: GrantType;
};

const ProjectMilestonesTable: FC<ProjectMilestonesProps> = ({
  milestones,
  total,
  hasAppliedSearch,
  isLead,
  loadArticleOptions,
  fetchLinkedArticles,
  selectedGrantType,
  pageControlsProps,
}) => {
  const grantLabel =
    selectedGrantType === 'supplement' ? 'Supplement' : 'Original';

  const resultsFoundText =
    total === 1 ? `${total} result found` : `${total} results found`;

  if (!milestones.length) {
    if (!hasAppliedSearch) {
      return (
        <Paragraph accent="lead" noMargin styles={noMilestonesTextStyles}>
          No milestones related to the {grantLabel} Grant have been added to
          this project yet.
        </Paragraph>
      );
    }

    return (
      <div css={containerStyles}>
        <strong>{resultsFoundText}</strong>
        <div css={noResultsStyles}>
          <div css={noResultsIconStyles} aria-hidden>
            {searchIcon}
          </div>
          <div>
            <Headline3 noMargin>No results found.</Headline3>
          </div>
          <Paragraph noMargin accent="lead">
            Please double-check your search for any typos or try a different
            search term.
          </Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div css={containerStyles}>
      <strong>{resultsFoundText}</strong>
      <Card padding={false}>
        <div css={contentStyles}>
          <div css={milestonesGridStyles}>
            <div css={tableHeaderStyles}>
              <div css={[headerLabelStyles, aimsHeaderStyles]}>Aims</div>
              <div css={[headerLabelStyles, milestoneHeaderStyles]}>
                Milestone
              </div>
              <div css={[headerLabelStyles, statusHeaderStyles]}>Status</div>
            </div>
            <div css={milestonesListStyles}>
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  css={milestoneRowWrapperStyles(
                    index,
                    index === milestones.length - 1,
                  )}
                >
                  <Milestone
                    milestone={milestone}
                    fetchLinkedArticles={fetchLinkedArticles}
                    isLead={isLead}
                    loadArticleOptions={loadArticleOptions}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <section css={pageControlsStyles}>
        <PageControls {...pageControlsProps} />
      </section>
    </div>
  );
};

export default ProjectMilestonesTable;
