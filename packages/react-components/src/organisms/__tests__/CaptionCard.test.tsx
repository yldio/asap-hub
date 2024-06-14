import { render } from '@testing-library/react';

import Caption from '../CaptionCard';

it('renders the children', () => {
  const { container } = render(
    <Caption>
      <h1>Hello World</h1>
    </Caption>,
  );
  expect(container).toHaveTextContent('Hello World');
});
