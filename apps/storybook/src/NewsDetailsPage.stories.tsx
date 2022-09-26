import { NewsDetailsPage } from '@asap-hub/react-components';
import { createNewsResponse } from '@asap-hub/fixtures';

export default {
  title: 'Templates / News / News Details Page',
  component: NewsDetailsPage,
};

export const Normal = () => (
  <NewsDetailsPage {...createNewsResponse({ key: '1' })} />
);
