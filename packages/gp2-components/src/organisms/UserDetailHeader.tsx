import { TabLink, TabNav } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { ComponentProps } from 'react';
import { detailHeaderStyles } from '../layout';
import UserDetailHeaderCard from './UserDetailHeaderCard';

type UserDetailHeaderProps = ComponentProps<typeof UserDetailHeaderCard> & {
  outputsTotal?: number;
};

const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({ ...props }) => (
  <header css={detailHeaderStyles}>
    <UserDetailHeaderCard {...props} />
    <TabNav>
      <TabLink
        href={gp2Routing.users({}).user({ userId: props.id }).overview({}).$}
      >
        Overview
      </TabLink>
      <TabLink
        href={gp2Routing.users({}).user({ userId: props.id }).outputs({}).$}
      >
        Shared Outputs ({props.outputsTotal})
      </TabLink>
    </TabNav>
  </header>
);
export default UserDetailHeader;
