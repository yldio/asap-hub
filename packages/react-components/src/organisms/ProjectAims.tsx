import { ArticleItem, ProjectAimsGrant } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { Headline3, Card, Button, TabButton, Link, Paragraph } from '../atoms';
import { TabNav } from '../molecules';
import { rem, tabletScreen } from '../pixels';
import { neutral1000, steel } from '../colors';
import Aim from './Aim';

const contentStyles = css({
  padding: `${rem(32)} ${rem(24)} ${rem(16)} ${rem(24)}`,
});

const tabContainerStyles = css({
  marginBottom: rem(24),
  borderBottom: `1px solid ${steel.rgb}`,
});

const aimsGridStyles = css({
  display: 'grid',
  gridTemplateColumns: `${rem(33)} 1fr auto`,
  columnGap: rem(24),
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    gridTemplateColumns: '1fr',
  },
});

const headerRowStyles = css({
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

const viewMoreContainerStyles = (hasMore: boolean) =>
  css({
    marginTop: hasMore ? rem(32) : 0,
    paddingTop: rem(16),
    borderTop: hasMore ? `1px solid ${steel.rgb}` : 'none',
    textAlign: 'center',
  });

type ProjectAimsProps = {
  aims: ReadonlyArray<ProjectAimsGrant>;
  initialDisplayCount?: number;
  fetchArticles?: (aimId: string) => Promise<ReadonlyArray<ArticleItem>>;
};

const noopFetchArticles = (): Promise<ReadonlyArray<ArticleItem>> =>
  Promise.resolve([]);

const AimsList: FC<{
  aims: ProjectAimsGrant['aims'];
  initialDisplayCount: number;
  showAll: boolean;
  onToggleShowAll: () => void;
  fetchArticles: (aimId: string) => Promise<ReadonlyArray<ArticleItem>>;
}> = ({
  aims,
  initialDisplayCount,
  showAll,
  onToggleShowAll,
  fetchArticles,
}) => {
  const displayedAims = showAll ? aims : aims.slice(0, initialDisplayCount);
  const hasMore = aims.length > initialDisplayCount;

  return (
    <>
      <div css={aimsGridStyles}>
        <div css={headerRowStyles}>
          <div css={headerLabelStyles}>Aim</div>
          <div css={headerLabelStyles}>Description</div>
          <div css={headerLabelStyles}>Status</div>
        </div>
        {displayedAims.map((aim) => (
          <Aim key={aim.id} aim={aim} fetchArticles={fetchArticles} />
        ))}
      </div>
      <div css={viewMoreContainerStyles(hasMore)}>
        {hasMore && (
          <Button
            id="project-aims-toggle-show-all"
            linkStyle
            onClick={onToggleShowAll}
          >
            {showAll ? 'View Less Aims' : 'View More Aims'}
          </Button>
        )}
      </div>
    </>
  );
};

// The `TabNav` component comes with padding and margin in its inner components,
// so we use a smaller margin when we render it.
const MULTI_TAB_MARGIN = 12;
// If we don't render the `TabNav`, this is the margin we want to use, both cases should look the same.
const SINGLE_TAB_MARGIN = 32;

const ProjectAims: FC<ProjectAimsProps> = ({
  aims,
  initialDisplayCount = 4,
  fetchArticles = noopFetchArticles,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showAllByTab, setShowAllByTab] = useState<Record<number, boolean>>({});

  const allAimsEmpty = aims.every((grant) => grant.aims.length === 0);
  if (!aims.length || allAimsEmpty) {
    return null;
  }

  const isTabbedView = aims.length > 1;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentGrant = aims[activeTab]!;

  return (
    <Card padding={false} title="Aims">
      <div css={contentStyles}>
        <Headline3 noMargin>Aims</Headline3>
        <Paragraph
          noMargin
          accent="lead"
          styles={css({
            marginTop: rem(24),
            marginBottom: rem(
              isTabbedView ? MULTI_TAB_MARGIN : SINGLE_TAB_MARGIN,
            ),
          })}
        >
          View the core research objectives of this project. Progress toward
          each aim is tracked through related milestones, and associated
          articles are displayed as they are linked through those milestones.{' '}
          <Link href="#">See milestones</Link>
        </Paragraph>

        {isTabbedView && (
          <div css={tabContainerStyles}>
            <TabNav>
              {aims.map((grant, index) => (
                <TabButton
                  key={grant.grantTitle}
                  active={index === activeTab}
                  onClick={() => setActiveTab(index)}
                >
                  {grant.grantTitle} ({grant.aims.length})
                </TabButton>
              ))}
            </TabNav>
          </div>
        )}

        <AimsList
          aims={currentGrant.aims}
          initialDisplayCount={initialDisplayCount}
          showAll={!!showAllByTab[activeTab]}
          onToggleShowAll={() =>
            setShowAllByTab((prev) => ({
              ...prev,
              [activeTab]: !prev[activeTab],
            }))
          }
          fetchArticles={fetchArticles}
        />
      </div>
    </Card>
  );
};

export default ProjectAims;
