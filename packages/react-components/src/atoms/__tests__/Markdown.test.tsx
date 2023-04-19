import { render } from '@testing-library/react';

import Markdown from '../Markdown';

it('renders processed markdown text', () => {
  const { getByText } = render(
    <Markdown value={`# some text content\n **foo**`} />,
  );
  expect(getByText('some text content').tagName).toBe('H4');
  expect(getByText('foo').tagName).toBe('STRONG');
});

it('renders processed links', () => {
  const { getByText } = render(<Markdown value={`[foo](http://link.com)`} />);
  const link = getByText('foo');
  expect(link.tagName).toBe('A');
  expect(link.getAttribute('href')).toBe('http://link.com');
});

it('avoid basic xss risks', () => {
  const text = `<a href="#" onmouseover="alert('xss')">xss over</a>`;
  const { getByText } = render(<Markdown value={text} />);

  const tag = getByText('xss over');
  expect(tag.tagName).toBe('P');
  expect(tag.getAttribute('href')).toBe(null);
  expect(tag.getAttribute('onmouseover')).toBe(null);
});
