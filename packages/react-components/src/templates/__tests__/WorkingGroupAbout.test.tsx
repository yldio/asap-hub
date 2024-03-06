import { createWorkingGroupPointOfContact } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';

import WorkingGroupAbout from '../WorkingGroupAbout';

const baseProps: ComponentProps<typeof WorkingGroupAbout> = {
  membersListElementId: '',
  description: '',
  pointOfContact: undefined,
  deliverables: [],
  members: [],
  leaders: [],
  complete: false,
  tags: [],
};

it('renders the description', () => {
  const { getByText } = render(
    <WorkingGroupAbout
      {...baseProps}
      description="<p><strong>Text content</strong></p>"
    />,
  );
  expect(getByText('Working Group Description')).toBeVisible();
  expect(getByText('Text content')).toBeVisible();
});

it('renders a list of deliverables', () => {
  const { getByText } = render(
    <WorkingGroupAbout
      {...baseProps}
      deliverables={[
        { description: 'Deliverable 1', status: 'Complete' },
        { description: 'Deliverable 2', status: 'In Progress' },
      ]}
    />,
  );
  expect(getByText('Deliverable 1')).toBeVisible();
  expect(getByText('Complete')).toBeVisible();
  expect(getByText('Deliverable 2')).toBeVisible();
  expect(getByText('In Progress')).toBeVisible();
});

it('renders collaboration invite if not completed', () => {
  const { getByText, queryByText, rerender } = render(
    <WorkingGroupAbout {...baseProps} />,
  );
  expect(
    getByText('Would you like to collaborate with this Working Group?'),
  ).toBeVisible();
  rerender(<WorkingGroupAbout {...baseProps} complete={true} />);
  expect(
    queryByText('Would you like to collaborate with this Working Group?'),
  ).not.toBeInTheDocument();
});

it('renders CTA when pointOfContact is provided', () => {
  const { queryAllByText, rerender } = render(
    <WorkingGroupAbout
      {...baseProps}
      pointOfContact={createWorkingGroupPointOfContact()}
    />,
  );
  expect(queryAllByText('Contact PM')).toHaveLength(2);
  rerender(<WorkingGroupAbout {...baseProps} />);
  expect(queryAllByText('Contact PM')).toHaveLength(0);
});

it('does not render CTA when pointOfContact is provided but working group is complete', () => {
  const { queryAllByText } = render(
    <WorkingGroupAbout
      {...baseProps}
      pointOfContact={createWorkingGroupPointOfContact()}
      complete
    />,
  );
  expect(queryAllByText('Contact PM')).toHaveLength(0);
});

it('renders a list of tags', () => {
  const { getByRole } = render(
    <WorkingGroupAbout {...baseProps} tags={['Tag One', 'Tag Two']} />,
  );
  expect(getByRole('link', { name: 'Tag One' })).toBeVisible();
  expect(getByRole('link', { name: 'Tag Two' })).toBeVisible();
});
