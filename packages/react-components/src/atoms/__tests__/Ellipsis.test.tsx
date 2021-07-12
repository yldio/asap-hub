import { render } from '@testing-library/react';

import Ellipsis from '../Ellipsis';

it('renders ellipse with content', () => {
  const { container } = render(<Ellipsis>Text</Ellipsis>);
  expect(container.textContent).toEqual('Text');
});
