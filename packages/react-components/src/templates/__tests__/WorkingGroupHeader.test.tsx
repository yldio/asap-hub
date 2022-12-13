import { createUserResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';

import WorkingGroupHeader from '../WorkingGroupHeader';

const baseProps: ComponentProps<typeof WorkingGroupHeader> = {
  id: 'id',
  title: '',
  complete: false,
  externalLink: '',
  lastModifiedDate: new Date('2021-01-01').toISOString(),
  pointOfContact: undefined,
  members: [],
};

it('renders the title', () => {
  const { getByText } = render(
    <WorkingGroupHeader {...baseProps} title="A test group" />,
  );
  expect(getByText('A test group')).toBeVisible();
});

it('renders CTA when pointOfContact is provided', () => {
  const { queryAllByText, rerender } = render(
    <WorkingGroupHeader
      {...baseProps}
      pointOfContact={{
        ...createUserResponse(),
        id: '2',
        displayName: 'Peter Venkman',
        firstName: 'Peter',
        lastName: 'Venkman',
        email: 'peter@ven.com',
      }}
    />,
  );
  expect(queryAllByText('Contact PM')).toHaveLength(1);
  rerender(<WorkingGroupHeader {...baseProps} />);
  expect(queryAllByText('Contact PM')).toHaveLength(0);
});

it('renders a complete tag when complete is true', () => {
  const { queryByText, getByText, getByTitle, rerender } = render(
    <WorkingGroupHeader {...baseProps} />,
  );
  expect(queryByText('Complete')).toBeNull();
  rerender(<WorkingGroupHeader {...baseProps} complete />);
  expect(getByTitle('Success')).toBeInTheDocument();
  expect(getByText('Complete')).toBeVisible();
});

it('renders the member avatars', () => {
  const { getByLabelText } = render(
    <WorkingGroupHeader
      {...baseProps}
      members={[
        {
          user: { ...createUserResponse(), firstName: 'John', lastName: 'Doe' },
        },
      ]}
    />,
  );
  expect(getByLabelText(/pic.+John Doe/i)).toBeVisible();
});

it('renders a Working Group Folder when externalLink is provided', () => {
  const { queryByText, getByText, rerender } = render(
    <WorkingGroupHeader {...baseProps} />,
  );
  expect(queryByText('Working Group Folder')).toBeNull();
  rerender(
    <WorkingGroupHeader {...baseProps} externalLink="http://www.hub.com" />,
  );
  expect(getByText('Working Group Folder')).toBeVisible();
});
