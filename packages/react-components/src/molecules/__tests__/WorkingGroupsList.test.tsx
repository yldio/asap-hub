import { render } from '@testing-library/react';

import WorkingGroupsList from '../WorkingGroupsList';

it('displays a list of groups', () => {
  const props = {
    groups: [
      {
        id: '1',
        role: 'Product Manager',
        name: 'Foo Bar',
      },
    ],
  };

  const { getByText } = render(<WorkingGroupsList {...props} />);

  const link = getByText('Foo Bar');
  expect(link).toBeInTheDocument();
  expect(link.getAttribute('href')).toBe('/network/working-groups/1');
  expect(getByText('Product Manager')).toBeInTheDocument();
});
