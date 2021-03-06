import { NewsOrEventPage } from '@asap-hub/react-components';
import { createNewsAndEventsResponse } from '@asap-hub/fixtures';

export default {
  title: 'Templates / News / News Or Event Page',
  component: NewsOrEventPage,
};

export const Normal = () => (
  <NewsOrEventPage {...createNewsAndEventsResponse('1')} />
);
