import { gp2 } from '@asap-hub/model';
import {
  drawerQuery,
  Paragraph,
  pixels,
  Subtitle,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import WorkingGroupCard from './WorkingGroupCard';

const { perRem } = pixels;
type WorkingGroupsBodyProps = {
  workingGroupNetwork: gp2.ListWorkingGroupNetworkResponse;
};
const styles = css({
  marginTop: `${48 / perRem}em`,
});

const gridContainerStyles = css({
  display: 'grid',
  gridGap: `${24 / perRem}em`,
  gridTemplateColumns: '1fr 1fr',
  marginTop: `${24 / perRem}em`,

  [drawerQuery]: {
    gridTemplateColumns: '1fr',
  },
});

const WorkingGroupsBody: React.FC<WorkingGroupsBodyProps> = ({
  workingGroupNetwork,
}) => {
  const complexDiseaseWorkingGroups = workingGroupNetwork.items
    .filter((network) => network.role === 'complexDisease')
    .flatMap(({ workingGroups }) => workingGroups);

  return (
    <div css={styles}>
      <Subtitle hasMargin={false}>Operational Working Groups</Subtitle>
      <Paragraph hasMargin={false} accent="lead">
        Manage the day to day workings of the GP2 working group structure.
      </Paragraph>
      <article css={gridContainerStyles}>
        {complexDiseaseWorkingGroups.map((workingGroup) => (
          <WorkingGroupCard key={workingGroup.id} {...workingGroup} />
        ))}
      </article>
    </div>
  );
};

export default WorkingGroupsBody;
