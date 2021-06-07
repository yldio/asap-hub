import { render } from '@testing-library/react';

import Pill from '../Pill';

it('renders a tag label with content', () => {
  const { container } = render(<Pill>Text</Pill>);
  expect(container.textContent).toEqual('Text');
});
