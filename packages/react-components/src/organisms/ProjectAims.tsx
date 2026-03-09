import { ProjectAimsGrant } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { Headline3, Card, Button, TabButton, Link, Paragraph } from '../atoms';
import { TabNav } from '../molecules';
import { rem, tabletScreen } from '../pixels';
import { neutral1000, steel } from '../colors';
import Aim, { AIM_COLUMN_GAP, AIM_TEMPLATE_COLUMNS } from './Aim';

const contentStyles = css({
  padding: `${rem(32)} ${rem(24)} ${rem(16)} ${rem(24)}`,
});

const tabContainerStyles = css({
  marginBottom: rem(24),
  borderBottom: `1px solid ${steel.rgb}`,
});

const tableHeaderStyles = css({
  display: 'grid',
  gridTemplateColumns: AIM_TEMPLATE_COLUMNS,
  gap: rem(AIM_COLUMN_GAP),
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

const aimsListStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
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
};

const AimsList: FC<{
  aims: ProjectAimsGrant['aims'];
  initialDisplayCount: number;
  showAll: boolean;
  onToggleShowAll: () => void;
}> = ({ aims, initialDisplayCount, showAll, onToggleShowAll }) => {
  const displayedAims = showAll ? aims : aims.slice(0, initialDisplayCount);
  const hasMore = aims.length > initialDisplayCount;

  return (
    <>
      <div css={tableHeaderStyles}>
        <div css={headerLabelStyles}>Aim</div>
        <div css={headerLabelStyles}>Description</div>
        <div css={headerLabelStyles}>Status</div>
      </div>
      <div css={aimsListStyles}>
        {displayedAims.map((aim) => (
          <Aim key={aim.id} aim={aim} />
        ))}
      </div>
      <div css={viewMoreContainerStyles(hasMore)}>
        {hasMore && (
          <Button linkStyle onClick={onToggleShowAll}>
            {showAll ? 'View Less Aims' : 'View More Aims'}
          </Button>
        )}
      </div>
    </>
  );
};

const ProjectAims: FC<ProjectAimsProps> = ({
  aims,
  initialDisplayCount = 4,
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
        <Paragraph noMargin accent="lead" styles={css({ marginTop: rem(24) })}>
          View the core research objectives of this project. Progress toward
          each aim is tracked through related milestones, and associated
          articles are displayed as they are linked through those milestones.{' '}
          <Link href="#">See milestones</Link>
        </Paragraph>

        <div style={{ marginTop: rem(32) }} />

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
        />
      </div>
    </Card>
  );
};

export default ProjectAims;
