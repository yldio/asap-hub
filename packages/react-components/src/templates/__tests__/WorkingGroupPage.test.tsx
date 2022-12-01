import { render } from '@testing-library/react';
import { ComponentProps } from 'react';

import WorkingGroupPage from '../WorkingGroupPage';

const baseProps: ComponentProps<typeof WorkingGroupPage> = {
  id: 'id',
  title: '',
  complete: false,
  externalLink: 'link',
  externalLinkText: 'link text',
  lastModifiedDate: new Date('2021-01-01').toISOString(),
  pointOfContact: undefined,
  members: [],
};
it('renders the header', () => {
  const { getByText } = render(
    <WorkingGroupPage {...baseProps} title="A test group">
      Tab Content
    </WorkingGroupPage>,
  );
  expect(getByText('A test group')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(
    <WorkingGroupPage {...baseProps}>Tab Content</WorkingGroupPage>,
  );
  expect(getByText('Tab Content')).toBeVisible();
});
