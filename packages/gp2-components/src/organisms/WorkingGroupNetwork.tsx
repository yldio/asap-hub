import { gp2 } from '@asap-hub/model';
import {
  drawerQuery,
  Paragraph,
  pixels,
  Subtitle,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import WorkingGroupCard from './WorkingGroupCard';
import { WorkingGroupsBodyProps } from './WorkingGroupsBody';

const { perRem } = pixels;
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
const WorkingGroupNetwork: React.FC<
  {
    role: gp2.WorkingGroupNetworkRole;
  } & WorkingGroupsBodyProps
> = ({ role, workingGroupNetwork }) => {
  const complexDiseaseWorkingGroups = workingGroupNetwork.items
    .filter((network) => network.role === role)
    .flatMap(({ workingGroups }) => workingGroups);

  const descriptions: Record<
    gp2.WorkingGroupNetworkRole,
    { subtitle: string; paragraph: string }
  > = {
    steeringCommitee: {
      subtitle: 'Steering Commitee',
      paragraph:
        'Provide additional support and assistance to the functioning of the other GP2 working groups.',
    },
    complexDisease: {
      subtitle: 'Complex Disease Network',
      paragraph:
        'One of the two clusters of GP2 working groups focusing on data collection and analysis.',
    },
    monogenic: {
      subtitle: 'Monogenic Working Groups',
      paragraph:
        'One of the two clusters of GP2 working groups focusing on data collection and analysis.',
    },
    operational: {
      subtitle: 'Operational Working Groups',
      paragraph:
        'Manage the day to day workings of the GP2 working group structure.',
    },
  };

  return (
    <div css={styles}>
      <Subtitle margin={false}>{descriptions[role].subtitle}</Subtitle>
      <Paragraph margin={false} accent="lead">
        {descriptions[role].paragraph}
      </Paragraph>
      <article css={gridContainerStyles}>
        {complexDiseaseWorkingGroups.map((workingGroup) => (
          <WorkingGroupCard key={workingGroup.id} {...workingGroup} />
        ))}
      </article>
    </div>
  );
};

export default WorkingGroupNetwork;
