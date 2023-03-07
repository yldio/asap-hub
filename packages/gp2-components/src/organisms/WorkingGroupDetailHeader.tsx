import { gp2 as gp2Model } from '@asap-hub/model';
import {
  drawerQuery,
  pixels,
  Subtitle,
  TabLink,
  TabNav,
  utils,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';

import { css } from '@emotion/react';
import { projectIcon, usersIcon } from '../icons';
import { workingGroupsImage } from '../images';
import { detailHeaderStyles } from '../layout';
import CardWithBackground from '../molecules/CardWithBackground';
import IconWithLabel from '../molecules/IconWithLabel';
import ShareOutputButton from '../molecules/ShareOutputButton';

const { rem } = pixels;

type WorkingGroupDetailHeaderProps = Pick<
  gp2Model.WorkingGroupResponse,
  'title' | 'members' | 'id'
> & {
  projects?: unknown[];
  isWorkingGroupMember: boolean;
  isAdministrator: boolean;
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
  title,
  members,
  projects,
  id,
  isWorkingGroupMember,
  isAdministrator,
}) => {
  const route = gp2Routing
    .workingGroups({})
    .workingGroup({ workingGroupId: id });
  return (
    <header css={detailHeaderStyles}>
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
          {isAdministrator && (
            <div css={css({ marginLeft: 'auto' })}>
              <ShareOutputButton id={id} entityType="workingGroup" />
            </div>
          )}
        </div>
      </CardWithBackground>
      <TabNav>
        <TabLink href={route.overview({}).$}>Overview</TabLink>
        {isWorkingGroupMember && (
          <TabLink href={route.resources({}).$}>Resources</TabLink>
        )}
      </TabNav>
    </header>
  );
};
export default WorkingGroupDetailHeader;
