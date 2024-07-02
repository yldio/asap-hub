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
import { useFlags } from '@asap-hub/react-context';

import { css } from '@emotion/react';
import { usersIcon } from '../icons';
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
  isWorkingGroupMember: boolean;
  isAdministrator: boolean;
  outputsTotal: number;
  upcomingTotal: number;
  pastTotal: number;
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
  id,
  isWorkingGroupMember,
  isAdministrator,
  outputsTotal,
  upcomingTotal,
  pastTotal,
}) => {
  const { isEnabled } = useFlags();
  // const route = gp2Routing
  //   .workingGroups({})
  //   .workingGroup({ workingGroupId: id });
  const route = gp2Routing.workingGroups.DEFAULT.DETAILS;
  return (
    <header css={detailHeaderStyles}>
      <CardWithBackground image={workingGroupsImage}>
        <Subtitle>Working Group</Subtitle>
        <h2>{title}</h2>
        <div css={infoContainerStyles}>
          <IconWithLabel icon={usersIcon}>
            {getCounterString(members.length, 'member')}
          </IconWithLabel>
          {isAdministrator && (
            <div css={css({ marginLeft: 'auto' })}>
              <ShareOutputButton id={id} entityType="workingGroup" />
            </div>
          )}
        </div>
      </CardWithBackground>
      <TabNav>
        <TabLink href={route.OVERVIEW.buildPath({ workingGroupId: id })}>
          Overview
        </TabLink>
        {isWorkingGroupMember && (
          <TabLink href={route.WORKSPACE.buildPath({ workingGroupId: id })}>
            Workspace
          </TabLink>
        )}
        <TabLink href={route.OUTPUTS.buildPath({ workingGroupId: id })}>
          Shared Outputs ({outputsTotal})
        </TabLink>
        {isEnabled('DISPLAY_EVENTS') && (
          <TabLink href={route.UPCOMING.buildPath({ workingGroupId: id })}>
            Upcoming Events ({upcomingTotal})
          </TabLink>
        )}
        {isEnabled('DISPLAY_EVENTS') && (
          <TabLink href={route.PAST.buildPath({ workingGroupId: id })}>
            Past Events ({pastTotal})
          </TabLink>
        )}
      </TabNav>
    </header>
  );
};
export default WorkingGroupDetailHeader;
