import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { UserOverview } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Templates / Users Directory / User Overview',
  component: UserOverview,
};

const item = {
  ...gp2Fixtures.createUserResponse(),
  backHref: '/',
};

export const Normal = () => <UserOverview {...item} />;
export const NoSocial = () => (
  <UserOverview {...item} {...{ social: undefined }} />
);
