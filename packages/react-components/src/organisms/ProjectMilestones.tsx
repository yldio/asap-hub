import { Milestone as MilestoneType } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC } from 'react';
import { Card } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import Milestone from './Milestone';
import { neutral1000, neutral200, steel } from '../colors';
import type { ResearchOutputOption } from '../utils';

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

type ProjectMilestonesProps = {
  milestones: ReadonlyArray<MilestoneType>;
  isLead: boolean;
  loadArticleOptions: (inputValue: string) => Promise<ResearchOutputOption[]>;
};

const ProjectMilestones: FC<ProjectMilestonesProps> = ({
  milestones,
  isLead,
  loadArticleOptions,
}) => {
  if (!milestones.length) {
    return null;
  }

  return (
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
                  isLead={isLead}
                  loadArticleOptions={loadArticleOptions}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectMilestones;
