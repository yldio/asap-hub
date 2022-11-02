import { render } from '@testing-library/react';

import WorkingGroupAbout from '../WorkingGroupAbout';

const baseProps = {
  description: 'Text content',
  pointOfContact: undefined,
  members: [],
};

it('renders the description', () => {
  const { getByText } = render(<WorkingGroupAbout {...baseProps} />);
  expect(getByText('Working Group Description')).toBeVisible();
  expect(getByText('Text content')).toBeVisible();
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
        role: 'Project Manager',
      }}
    />,
  );
  expect(queryAllByText('Contact PM')).toHaveLength(2);
  rerender(<WorkingGroupAbout {...baseProps} />);
  expect(queryAllByText('Contact PM')).toHaveLength(0);
});
