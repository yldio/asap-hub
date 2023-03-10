import { ComponentProps } from 'react';
import {
  createWorkingGroupMembers,
  createWorkingGroupPointOfContact,
} from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';

import WorkingGroupHeader from '../WorkingGroupPageHeader';

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
  workingGroupsOutputsCount: 0,
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

describe('Share an output button dropdown', () => {
  const renderWithPermissionsContext = (
    canShareResearchOutput: boolean = true,
  ) =>
    render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canShareResearchOutput,
          canEditResearchOutput: true,
          canPublishResearchOutput: true,
        }}
      >
        <WorkingGroupHeader {...baseProps} title="A test group" />
      </ResearchOutputPermissionsContext.Provider>,
    );

  it('renders share an output button when user can share research output', () => {
    renderWithPermissionsContext();

    expect(
      screen.queryByText(/article/i, { selector: 'span' }),
    ).not.toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Share an output/i }));
    expect(screen.getByText(/article/i, { selector: 'span' })).toBeVisible();
    expect(
      screen.getByText(/article/i, { selector: 'span' }).closest('a'),
    ).toHaveAttribute(
      'href',
      '/network/working-groups/id/create-output/article',
    );
  });
  it('does not render share an output button dropdown when user cannot share research output', () => {
    renderWithPermissionsContext(false);

    expect(
      screen.queryByRole('button', { name: /Share an output/i }),
    ).not.toBeInTheDocument();
  });
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
    `/network/working-groups/id/about#${baseProps.membersListElementId}`,
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

it('renders the provided number of research outputs', () => {
  const { getByText } = render(
    <WorkingGroupHeader {...baseProps} workingGroupsOutputsCount={2} />,
  );
  expect(getByText('Working Group Outputs (2)')).toBeVisible();
});
