import { gp2 } from '@asap-hub/model';
import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import WorkingGroupCard from './WorkingGroupCard';

const { perRem, smallDesktopScreen } = pixels;
type WorkingGroupsBodyProps = {
  workingGroups: gp2.ListWorkingGroupResponse;
};
const gridContainerStyles = css({
  display: 'grid',
  gridGap: `${24 / perRem}em`,
  gridTemplateColumns: '1fr 1fr',
  marginTop: `${48 / perRem}em`,

  [`@media (max-width: ${smallDesktopScreen.min}px)`]: {
    gridTemplateColumns: '1fr',
  },
});

const WorkingGroupsBody: React.FC<WorkingGroupsBodyProps> = ({
  workingGroups,
}) => (
  <article css={gridContainerStyles}>
    {workingGroups.items.map((workingGroup, idx) => (
      <WorkingGroupCard key={idx} {...workingGroup} />
    ))}
  </article>
);

export default WorkingGroupsBody;
