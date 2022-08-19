import {
  BackLink,
  drawerQuery,
  Subtitle,
  TabLink,
  TabNav,
} from '@asap-hub/react-components';
import { getCounterString } from '@asap-hub/react-components/src/utils';
import { css } from '@emotion/react';
import projectIcon from '../icons/project-icon';
import usersIcon from '../icons/users-icon';
import { workingGroupsImage } from '../images';
import CardWithBackground from '../molecules/CardWithBackground';
import IconWithLabel from '../molecules/IconWithLabel';

type WorkingGroupResponse = {
  id: string;
  title: string;
  shortDescription: string;
  leadingMembers?: string;
  members: unknown[];
  projects: unknown[];
  backHref: string;
};

const WorkingGroupDetailPage: React.FC<WorkingGroupResponse> = ({
  title,
  members,
  projects,
  backHref,
}) => (
  <>
    <BackLink href={backHref} />
    <CardWithBackground image={workingGroupsImage}>
      <Subtitle>Working Group</Subtitle>
      <h2>{title}</h2>
      <div
        css={css({
          display: 'flex',
          flexDirection: 'row',
          gap: '32px',
          [drawerQuery]: {
            display: 'unset',
          },
        })}
      >
        <IconWithLabel icon={usersIcon}>
          {getCounterString(members.length, 'member')}
        </IconWithLabel>
        <IconWithLabel icon={projectIcon}>
          {getCounterString(projects.length, 'project')}
        </IconWithLabel>
      </div>
    </CardWithBackground>
    <TabNav>
      <TabLink href={''}>Overview</TabLink>
    </TabNav>
  </>
);

export default WorkingGroupDetailPage;
