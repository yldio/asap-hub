import { gp2 as gp2Model } from '@asap-hub/model';
import {
  BackLink,
  drawerQuery,
  pixels,
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

const { rem } = pixels;

type WorkingGroupDetailHeaderProps = Pick<
  gp2Model.WorkingGroupResponse,
  'title' | 'members' | 'id'
> & {
  projects?: unknown[];
  backHref: string;
  isWorkingGroupMember: boolean;
};

const infoContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  gap: rem(32),
  [drawerQuery]: {
    display: 'unset',
  },
});

const { getCounterString } = utils;

const WorkingGroupDetailHeader: React.FC<WorkingGroupDetailHeaderProps> = ({
  backHref,
  title,
  members,
  projects,
  id,
  isWorkingGroupMember,
}) => (
  <header>
    <BackLink href={backHref} />
    <CardWithBackground image={workingGroupsImage}>
      <Subtitle>Working Group</Subtitle>
      <h2>{title}</h2>
      <div css={infoContainerStyles}>
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
      {isWorkingGroupMember && (
        <TabLink
          href={
            gp2Routing
              .workingGroups({})
              .workingGroup({ workingGroupId: id })
              .resources({}).$
          }
        >
          Resources
        </TabLink>
      )}
    </TabNav>
  </header>
);
export default WorkingGroupDetailHeader;
