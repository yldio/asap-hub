import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import userEvent from '@testing-library/user-event';

import Accordion from '../Accordion';

const testSvg = (
  <svg>
    <title>Icon</title>
  </svg>
);

const item: ComponentProps<typeof Accordion>['items'][number] = {
  title: 'title',
  description: 'description',
  href: '/example',
  hrefText: 'href text',
  icon: testSvg,
};

it('displays an item', () => {
  render(
    <Accordion
      items={[
        {
          title: 'title',
          description: 'description',
          href: '/example',
          hrefText: 'href text',
          icon: testSvg,
        },
      ]}
    />,
  );
  expect(screen.getByRole('heading').textContent).toEqual('title');
  expect(screen.getByText('description')).toBeVisible();
  const link = screen.getByRole('link');
  expect(link.textContent).toMatch(/href text/);
  expect(link).toHaveAttribute('href', '/example');
  expect(screen.getByTitle('Icon')).toBeInTheDocument();
});

it('shows the external link icon when appropriate', () => {
  render(<Accordion items={[{ ...item, href: '/internal' }]} />);
  expect(screen.queryByTitle('External Link')).not.toBeInTheDocument();
  render(<Accordion items={[{ ...item, href: 'http://example.com' }]} />);
  expect(screen.queryByTitle('External Link')).toBeInTheDocument();
});

it('displays multiple items', () => {
  render(
    <Accordion
      items={[
        { ...item, title: 'title 1' },
        { ...item, title: 'title 2' },
      ]}
    />,
  );
  expect(
    screen.getAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['title 1', 'title 2']);
});
describe('open close behaviour', () => {
  const isContentHidden = (description: string) =>
    findParentWithStyle(screen.getByText(description), 'maxHeight')
      ?.maxHeight === '0';

  it('opens an item', () => {
    render(
      <Accordion
        items={[
          { ...item, title: 'title 1', description: 'description 1' },
          { ...item, title: 'title 2', description: 'description 2' },
        ]}
      />,
    );

    expect(isContentHidden('description 1')).toBe(true);
    userEvent.click(screen.getByText('title 1'));
    expect(isContentHidden('description 1')).toBe(false);
  });

  it('closes the previous item when a new item is opened', () => {
    render(
      <Accordion
        items={[
          { ...item, title: 'title 1', description: 'description 1' },
          { ...item, title: 'title 2', description: 'description 2' },
        ]}
      />,
    );

    expect(isContentHidden('description 1')).toBe(true);
    expect(isContentHidden('description 2')).toBe(true);
    userEvent.click(screen.getByText('title 1'));
    expect(isContentHidden('description 1')).toBe(false);
    expect(isContentHidden('description 2')).toBe(true);
    userEvent.click(screen.getByText('title 2'));
    expect(isContentHidden('description 1')).toBe(true);
    expect(isContentHidden('description 2')).toBe(false);
  });
});
