import { TabLink, TabNav } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { useFlags } from '@asap-hub/react-context';
import { ComponentProps } from 'react';
import { detailHeaderStyles } from '../layout';
import UserDetailHeaderCard from './UserDetailHeaderCard';

type UserDetailHeaderProps = ComponentProps<typeof UserDetailHeaderCard> & {
  outputsTotal: number;
  upcomingTotal: number;
  pastTotal: number;
};

const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({
  outputsTotal,
  upcomingTotal,
  pastTotal,
  id,
  ...headerProps
}) => {
  const { isEnabled } = useFlags();
  const route = gp2Routing.users.DEFAULT.DETAILS;
  return (
    <header css={detailHeaderStyles}>
      <UserDetailHeaderCard {...headerProps} id={id} />
      <TabNav>
        <TabLink href={route.OVERVIEW.buildPath({ userId: id })}>
          Overview
        </TabLink>
        <TabLink href={route.OUTPUTS.buildPath({ userId: id })}>
          Shared Outputs ({outputsTotal})
        </TabLink>
        {isEnabled('DISPLAY_EVENTS') && (
          <TabLink href={route.UPCOMING.buildPath({ userId: id })}>
            Upcoming Events ({upcomingTotal})
          </TabLink>
        )}
        {isEnabled('DISPLAY_EVENTS') && (
          <TabLink href={route.PAST.buildPath({ userId: id })}>
            Past Events ({pastTotal})
          </TabLink>
        )}
      </TabNav>
    </header>
  );
};
export default UserDetailHeader;
