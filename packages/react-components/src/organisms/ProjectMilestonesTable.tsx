import {
  ArticleItem,
  GrantType,
  Milestone as MilestoneType,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps, FC } from 'react';
import { Card, Paragraph } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import Milestone from './Milestone';
import { neutral1000, neutral200, steel } from '../colors';
import type { ResearchOutputOption } from '../utils';
import { PageControls } from '../molecules';

const contentStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
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
    ...(isLast ? { paddingBottom: rem(0), borderBottom: 'none' } : {}),
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

type ProjectMilestonesProps = {
  readonly milestones: ReadonlyArray<MilestoneType>;
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
  isLead,
  loadArticleOptions,
  fetchLinkedArticles,
  selectedGrantType,
  pageControlsProps,
}) => {
  const grantLabel =
    selectedGrantType === 'supplement' ? 'Supplement' : 'Original';
  if (!milestones.length) {
    return (
      <Paragraph accent="lead" noMargin styles={noMilestonesTextStyles}>
        No milestones related to the {grantLabel} Grant have been added to this
        project yet.
      </Paragraph>
    );
  }

  return (
    <>
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
    </>
  );
};

export default ProjectMilestonesTable;
