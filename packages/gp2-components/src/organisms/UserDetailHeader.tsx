import { TabLink, TabNav } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
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
  const route = gp2Routing.users({}).user({ userId: id });
  return (
    <header css={detailHeaderStyles}>
      <UserDetailHeaderCard {...headerProps} id={id} />
      <TabNav>
        <TabLink href={route.overview({}).$}>Overview</TabLink>
        <TabLink href={route.outputs({}).$}>
          Shared Outputs ({outputsTotal})
        </TabLink>
        <TabLink href={route.upcoming({}).$}>
          Upcoming Events ({upcomingTotal})
        </TabLink>
        <TabLink href={route.past({}).$}>Past Events ({pastTotal})</TabLink>
      </TabNav>
    </header>
  );
};
export default UserDetailHeader;
