import React from 'react';
import { NewsOrEventPage } from '@asap-hub/react-components';
import { createNewsAndEventsResponse } from '@asap-hub/fixtures';

export default {
  title: 'Templates / News And Events / News Or Event Page',
  component: NewsOrEventPage,
};

export const Normal = () => (
  <NewsOrEventPage {...createNewsAndEventsResponse('1')} />
);
