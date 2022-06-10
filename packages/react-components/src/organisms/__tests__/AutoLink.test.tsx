import { render } from '@testing-library/react';

import AutoLink from '../AutoLink';

it('converts plaintext urls to link component', () => {
  const { getByRole } = render(
    <AutoLink
      content={`some text
    http://google.com
    some more test`}
    />,
  );
  expect(getByRole('link').textContent).toEqual('http://google.com');
  expect(getByRole('link')).toHaveAttribute('href', 'http://google.com');
});

it('escapes html', () => {
  const { container } = render(<AutoLink content={`<b>example</b>`} />);
  expect(container.innerHTML).toMatchInlineSnapshot(
    `"&lt;b&gt;example&lt;/b&gt;"`,
  );
});
