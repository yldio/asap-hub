import { ListWorkingGroupsResponse } from '@asap-hub/model/build/gp2';
import { Card, card, steel } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import WorkingGroupCard from './WorkingGroupCard';

const { paddingStyles } = card;
type WorkingGroupsBodyProps = {
  workingGroups: ListWorkingGroupsResponse;
};
const containerStyles = css({
  margin: 0,
  padding: 0,
  listStyle: 'none',
});
const itemStyles = css({
  borderBottom: `1px solid ${steel.rgb}`,
  display: 'grid',
  '&:last-of-type': {
    borderBottom: 'none',
  },
});

const WorkingGroupsBody: React.FC<WorkingGroupsBodyProps> = ({
  workingGroups,
}) => (
  <Card padding={false}>
    <ul css={containerStyles}>
      {workingGroups.items.map(({ id, ...workingGroup }) => (
        <li key={`working-group-${id}`} css={[itemStyles, paddingStyles]}>
          <WorkingGroupCard {...{ id, ...workingGroup }} />
        </li>
      ))}
    </ul>
  </Card>
);

export default WorkingGroupsBody;
