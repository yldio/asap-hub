import { render } from '@testing-library/react';
import { ComponentProps } from 'react';

import WorkingGroupAbout from '../WorkingGroupAbout';

const baseProps: ComponentProps<typeof WorkingGroupAbout> = {
  description: '',
  pointOfContact: undefined,
  deliverables: [],
};

it('renders the description', () => {
  const { getByText } = render(
    <WorkingGroupAbout {...baseProps} description="Text content" />,
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

it('renders CTA when pointOfContact is provided', () => {
  const { queryAllByText, rerender } = render(
    <WorkingGroupAbout
      {...baseProps}
      pointOfContact={{
        id: '2',
        displayName: 'Peter Venkman',
        firstName: 'Peter',
        lastName: 'Venkman',
        email: 'peter@ven.com',
        workingGroupRole: 'Project Manager',
      }}
    />,
  );
  expect(queryAllByText('Contact PM')).toHaveLength(2);
  rerender(<WorkingGroupAbout {...baseProps} />);
  expect(queryAllByText('Contact PM')).toHaveLength(0);
});
