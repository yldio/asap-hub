import { render } from '@testing-library/react';

import Markdown from '../Markdown';

it('renders processed markdown text', () => {
  const { getByText } = render(
    <Markdown value={`# some text content\n **foo**`} />,
  );
  expect(getByText('some text content').tagName).toBe('H1');
  expect(getByText('foo').tagName).toBe('STRONG');
});

it('renders processed links', () => {
  const { getByText } = render(<Markdown value={`[foo](http://link.com)`} />);
  const link = getByText('foo');
  expect(link.tagName).toBe('A');
  expect(link.getAttribute('href')).toBe('http://link.com');
});
