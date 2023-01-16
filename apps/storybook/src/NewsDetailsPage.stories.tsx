import { NewsDetailsPage } from '@asap-hub/react-components';
import { createNewsResponseWithType } from '@asap-hub/fixtures';

export default {
  title: 'Templates / News / News Details Page',
  component: NewsDetailsPage,
};

export const Normal = () => (
  <NewsDetailsPage {...createNewsResponseWithType({ key: '1' })} />
);
