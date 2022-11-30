import { useRouteParams, gp2 } from '@asap-hub/routing';

import { useBackHref } from '@asap-hub/frontend-utils';
import { UserDetailPage, UserOverview } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';

import { useUserById } from './state';

const { users } = gp2;
const UserDetail = () => {
  const { userId } = useRouteParams(users({}).user);
  const user = useUserById(userId);
  const backHref = useBackHref() ?? users({}).$;
  if (user) {
    return (
      <UserDetailPage backHref={backHref} {...user}>
        <UserOverview {...user} />
      </UserDetailPage>
    );
  }
  return <NotFoundPage />;
};

export default UserDetail;
