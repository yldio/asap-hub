import { render } from '@testing-library/react';

import PillList from '../PillList';

it('renders a list item for each pill', () => {
  const { getAllByRole } = render(<PillList pills={['P1', 'P2']} />);
  expect(getAllByRole('listitem')).toHaveLength(2);
  const [first, second] = getAllByRole('listitem');
  expect(first).toHaveTextContent('P1');
  expect(second).toHaveTextContent('P2');
});
