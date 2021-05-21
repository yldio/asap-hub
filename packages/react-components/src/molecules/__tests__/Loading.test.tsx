import { render } from '@testing-library/react';

import Loading from '../Loading';

it('says that something is loading', () => {
  const { container } = render(<Loading />);
  expect(container).toHaveTextContent(/loading/i);
});
