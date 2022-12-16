import {
  createWorkingGroupMembers,
  createWorkingGroupPointOfContact,
} from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';

import WorkingGroupHeader from '../WorkingGroupHeader';

const baseProps: ComponentProps<typeof WorkingGroupHeader> = {
  membersListElementId: 'members-list-elem-id',
  id: 'id',
  title: '',
  complete: false,
  externalLink: '',
  lastModifiedDate: new Date('2021-01-01').toISOString(),
  pointOfContact: undefined,
  leaders: [],
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
      pointOfContact={createWorkingGroupPointOfContact()}
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
      members={createWorkingGroupMembers(1)}
    />,
  );
  expect(getByLabelText(/pic.+ of .+/)).toBeVisible();
});

it('renders number of members exceeding the limit of 5 and anchors it to the right place', () => {
  const { getAllByLabelText, getByLabelText, getByRole } = render(
    <WorkingGroupHeader
      {...baseProps}
      members={createWorkingGroupMembers(6)}
    />,
  );
  expect(getAllByLabelText(/pic.+ of .+/)).toHaveLength(5);
  expect(getByLabelText(/\+1/)).toBeVisible();

  expect(getByRole('link', { name: /\+1/ })).toHaveAttribute(
    'href',
    `/network/working-groups/id#${baseProps.membersListElementId}`,
  );
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
