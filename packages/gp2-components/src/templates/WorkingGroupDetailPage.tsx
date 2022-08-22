import { gp2 } from '@asap-hub/model';
import {
  BackLink,
  drawerQuery,
  Subtitle,
  TabLink,
  TabNav,
  utils,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import projectIcon from '../icons/project-icon';
import usersIcon from '../icons/users-icon';
import { workingGroupsImage } from '../images';
import CardWithBackground from '../molecules/CardWithBackground';
import IconWithLabel from '../molecules/IconWithLabel';

type WorkingGroupDetailPageProps = Pick<
  gp2.WorkingGroupResponse,
  'title' | 'members'
> & {
  projects?: unknown[];
  backHref: string;
};

const { getCounterString } = utils;

const WorkingGroupDetailPage: React.FC<WorkingGroupDetailPageProps> = ({
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
          {getCounterString(projects?.length || 0, 'project')}
        </IconWithLabel>
      </div>
    </CardWithBackground>
    <TabNav>
      <TabLink href={''}>Overview</TabLink>
    </TabNav>
  </>
);

export default WorkingGroupDetailPage;
