import { render } from '@testing-library/react';

import Headline6 from '../Headline6';

it('renders the text in an <h6>', () => {
  const { getByText } = render(<Headline6>text</Headline6>);
  expect(getByText('text').tagName).toBe('H6');
});
