import { render } from '@testing-library/react';

import GlobalStyles from '../GlobalStyles';

it('applies global styles to the body', () => {
  render(<GlobalStyles />);
  expect(getComputedStyle(document.documentElement).fontFamily).toMatch(
    /^Roboto/,
  );
});
