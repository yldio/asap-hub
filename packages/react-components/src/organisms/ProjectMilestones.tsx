import { Milestone as MilestoneType } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { Headline3, Card, Button } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import Milestone from './Milestone';
import { lead, neutral1000 } from '../colors';

const contentStyles = css({
  padding: `${rem(32)} ${rem(24)} ${rem(16)} ${rem(24)}`,
});

const descriptionStyles = css({
  color: lead.rgb,
  fontSize: rem(17),
  marginBlock: rem(24),
});

const tableHeaderStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr 120px',
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

const descriptionHeaderStyles = css({
  flex: 1,
});

const statusHeaderStyles = css({
  flexShrink: 0,
});

const milestonesListStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
});

const viewMoreContainerStyles = (hasMore: boolean) =>
  css({
    marginTop: hasMore ? rem(32) : 0,
    paddingTop: rem(16),
    borderTop: hasMore ? `1px solid #E9ECEF` : 'none',
    textAlign: 'center',
  });

type ProjectMilestonesProps = {
  milestones: ReadonlyArray<MilestoneType>;
  initialDisplayCount?: number;
};

const ProjectMilestones: FC<ProjectMilestonesProps> = ({
  milestones,
  initialDisplayCount = 4,
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayedMilestones = showAll
    ? milestones
    : milestones.slice(0, initialDisplayCount);
  const hasMore = milestones.length > initialDisplayCount;

  if (!milestones.length) {
    return null;
  }

  return (
    <Card padding={false}>
      <div css={contentStyles}>
        <Headline3 noMargin>Milestones</Headline3>
        <p css={descriptionStyles}>The milestones of this project are:</p>
        <div css={tableHeaderStyles}>
          <div css={[headerLabelStyles, descriptionHeaderStyles]}>
            Description
          </div>
          <div css={[headerLabelStyles, statusHeaderStyles]}>Status</div>
        </div>
        <div css={milestonesListStyles}>
          {displayedMilestones.map((milestone) => (
            <Milestone key={milestone.id} milestone={milestone} />
          ))}
        </div>
        <div css={viewMoreContainerStyles(hasMore)}>
          {hasMore && (
            <Button linkStyle onClick={() => setShowAll(!showAll)}>
              {showAll ? `Show Less Milestones` : `Show More Milestones`}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectMilestones;
