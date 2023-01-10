import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { UserOverview } from '@asap-hub/gp2-components';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Templates / Users Directory / User Overview',
  component: UserOverview,
};

const item = {
  ...gp2Fixtures.createUserResponse(),
  backHref: '/',
};

export const Normal = () => (
  <UserOverview
    {...(boolean('Show social', true) ? item : { ...item, social: undefined })}
  />
);
