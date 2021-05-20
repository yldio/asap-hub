import { render } from '@testing-library/react';

import TagLabel from '../TagLabel';

it('renders a tag label with content', () => {
  const { container } = render(<TagLabel>Text</TagLabel>);
  expect(container.textContent).toEqual('Text');
});
