import { render } from '@testing-library/react';

import WorkingGroupHeader from '../WorkingGroupHeader';

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

it('renders the title', () => {
  const { getByText } = render(<WorkingGroupHeader {...baseProps} />);
  expect(getByText('A test group')).toBeVisible();
});

it('renders CTA when pointOfContact is provided', () => {
  const { queryAllByText, rerender } = render(
    <WorkingGroupHeader
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
  expect(getByTitle('checkmark in circle')).toBeInTheDocument();
  expect(getByText('Complete')).toBeVisible();
});
