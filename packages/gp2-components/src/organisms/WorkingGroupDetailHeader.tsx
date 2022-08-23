import { gp2 as gp2Model } from '@asap-hub/model';
import {
  BackLink,
  drawerQuery,
  Subtitle,
  TabLink,
  TabNav,
  utils,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';

import { css } from '@emotion/react';

import projectIcon from '../icons/project-icon';
import usersIcon from '../icons/users-icon';
import { workingGroupsImage } from '../images';
import CardWithBackground from '../molecules/CardWithBackground';
import IconWithLabel from '../molecules/IconWithLabel';

type WorkingGroupDetailHeaderProps = gp2Model.WorkingGroupResponse & {
  projects?: unknown[];
  backHref: string;
};

const { getCounterString } = utils;

const WorkingGroupDetailHeader: React.FC<WorkingGroupDetailHeaderProps> = ({
  backHref,
  title,
  members,
  projects,
  id,
}) => (
  <header>
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
      <TabLink
        href={
          gp2Routing
            .workingGroups({})
            .workingGroup({ workingGroupId: id })
            .overview({}).$
        }
      >
        Overview
      </TabLink>
    </TabNav>
  </header>
);
export default WorkingGroupDetailHeader;
