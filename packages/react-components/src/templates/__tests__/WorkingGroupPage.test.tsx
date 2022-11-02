import { render } from '@testing-library/react';

import WorkingGroupPage from '../WorkingGroupPage';

const baseProps = {
  id: 'id',
  name: 'A test group',
  complete: false,
  description: 'Text content',
  externalLink: 'link',
  externalLinkText: 'link text',
  lastUpdated: new Date('2021-01-01').toISOString(),
  pointOfContact: undefined,
  members: [],
};
it('renders the header', () => {
  const { getByText } = render(
    <WorkingGroupPage {...baseProps}>Tab Content</WorkingGroupPage>,
  );
  expect(getByText('A test group')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(
    <WorkingGroupPage {...baseProps}>Tab Content</WorkingGroupPage>,
  );
  expect(getByText('Tab Content')).toBeVisible();
});
