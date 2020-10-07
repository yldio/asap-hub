import React from 'react';
import { render } from '@testing-library/react';

import PageControls from '../PageControls';
import { mockConsoleError, findParentWithStyle } from '../../test-utils';
import { fern, tin } from '../../colors';

const renderPageHref = (page: number) => `#${page}`;

it(
  'rejects a negative index',
  mockConsoleError(() => {
    expect(() =>
      render(
        <PageControls
          numPages={1}
          currentIndex={-1}
          renderPageHref={renderPageHref}
        />,
      ),
    ).toThrow(/index.+-1/i);
  }),
);

it(
  'rejects an index beyond the existing pages',
  mockConsoleError(() => {
    expect(() =>
      render(
        <PageControls
          numPages={1}
          currentIndex={1}
          renderPageHref={renderPageHref}
        />,
      ),
    ).toThrow(/index.+1/i);
  }),
);

describe('the arrow controls', () => {
  it('contain a link to the first page', () => {
    const { getByTitle } = render(
      <PageControls
        numPages={3}
        currentIndex={2}
        renderPageHref={renderPageHref}
      />,
    );
    expect(
      findParentWithStyle(getByTitle(/first page/i), 'stroke')?.stroke?.replace(
        / /g,
        '',
      ),
    ).toBe(fern.rgb.replace(/ /g, ''));
    expect(getByTitle(/first page/i).closest('a')).toHaveAttribute(
      'href',
      '#0',
    );
  });
  it('disable the link to the first page on the first page', () => {
    const { getByTitle } = render(
      <PageControls
        numPages={3}
        currentIndex={0}
        renderPageHref={renderPageHref}
      />,
    );
    expect(
      findParentWithStyle(getByTitle(/first page/i), 'stroke')?.stroke?.replace(
        / /g,
        '',
      ),
    ).toBe(tin.rgb.replace(/ /g, ''));
    expect(getByTitle(/first page/i).closest('a')).not.toHaveAttribute('href');
  });

  it('contain a link to the previous page', () => {
    const { getByTitle } = render(
      <PageControls
        numPages={3}
        currentIndex={2}
        renderPageHref={renderPageHref}
      />,
    );
    expect(
      findParentWithStyle(
        getByTitle(/previous page/i),
        'stroke',
      )?.stroke?.replace(/ /g, ''),
    ).toBe(fern.rgb.replace(/ /g, ''));
    expect(getByTitle(/previous page/i).closest('a')).toHaveAttribute(
      'href',
      '#1',
    );
  });
  it('disable the link to the previous page on the first page', () => {
    const { getByTitle } = render(
      <PageControls
        numPages={3}
        currentIndex={0}
        renderPageHref={renderPageHref}
      />,
    );
    expect(
      findParentWithStyle(
        getByTitle(/previous page/i),
        'stroke',
      )?.stroke?.replace(/ /g, ''),
    ).toBe(tin.rgb.replace(/ /g, ''));
    expect(getByTitle(/previous page/i).closest('a')).not.toHaveAttribute(
      'href',
    );
  });

  it('contain a link to the next page', () => {
    const { getByTitle } = render(
      <PageControls
        numPages={3}
        currentIndex={0}
        renderPageHref={renderPageHref}
      />,
    );
    expect(
      findParentWithStyle(getByTitle(/next page/i), 'stroke')?.stroke?.replace(
        / /g,
        '',
      ),
    ).toBe(fern.rgb.replace(/ /g, ''));
    expect(getByTitle(/next page/i).closest('a')).toHaveAttribute('href', '#1');
  });
  it('disable the link to the next page on the last page', () => {
    const { getByTitle } = render(
      <PageControls
        numPages={3}
        currentIndex={2}
        renderPageHref={renderPageHref}
      />,
    );
    expect(
      findParentWithStyle(getByTitle(/next page/i), 'stroke')?.stroke?.replace(
        / /g,
        '',
      ),
    ).toBe(tin.rgb.replace(/ /g, ''));
    expect(getByTitle(/next page/i).closest('a')).not.toHaveAttribute('href');
  });

  it('contain a link to the last page', () => {
    const { getByTitle } = render(
      <PageControls
        numPages={3}
        currentIndex={0}
        renderPageHref={renderPageHref}
      />,
    );
    expect(
      findParentWithStyle(getByTitle(/last page/i), 'stroke')?.stroke?.replace(
        / /g,
        '',
      ),
    ).toBe(fern.rgb.replace(/ /g, ''));
    expect(getByTitle(/last page/i).closest('a')).toHaveAttribute('href', '#2');
  });
  it('disable the link to the last page on the last page', () => {
    const { getByTitle } = render(
      <PageControls
        numPages={3}
        currentIndex={2}
        renderPageHref={renderPageHref}
      />,
    );
    expect(
      findParentWithStyle(getByTitle(/last page/i), 'stroke')?.stroke?.replace(
        / /g,
        '',
      ),
    ).toBe(tin.rgb.replace(/ /g, ''));
    expect(getByTitle(/last page/i).closest('a')).not.toHaveAttribute('href');
  });
});

it.each`
  description                                                                 | currentPage | numPages | expected
  ${'renders the first, previous, current, next, and last page numbers'}      | ${5}        | ${9}     | ${'1 4 5 6 9'}
  ${'does not leave a gap of one page numbers'}                               | ${4}        | ${9}     | ${'1 2 3 4 5 9'}
  ${'does not render duplicate page numbers when first and previous overlap'} | ${2}        | ${9}     | ${'1 2 3 9'}
  ${'does not render negative page numbers on the first page'}                | ${1}        | ${9}     | ${'1 2 9'}
  ${'deals with a single page'}                                               | ${1}        | ${1}     | ${'1'}
`('$description', ({ numPages, currentPage, expected }) => {
  const { getAllByText } = render(
    <PageControls
      numPages={numPages}
      currentIndex={currentPage - 1}
      renderPageHref={renderPageHref}
    />,
  );
  expect(
    getAllByText(/\d+/)
      .map((e) => e.textContent)
      .join(' '),
  ).toBe(expected);
});

it('highlights the active page number', () => {
  const { getByText } = render(
    <PageControls
      numPages={9}
      currentIndex={5 - 1}
      renderPageHref={renderPageHref}
    />,
  );
  expect(getComputedStyle(getByText('4')).color).not.toBe(fern.rgb);
  expect(getComputedStyle(getByText('5')).color).toBe(fern.rgb);
});

it('links page numbers to the respective pages', () => {
  const { getByText } = render(
    <PageControls
      numPages={9}
      currentIndex={5 - 1}
      renderPageHref={renderPageHref}
    />,
  );
  expect(getByText('4').closest('a')).toHaveAttribute('href', '#3');
  expect(getByText('5').closest('a')).toHaveAttribute('href', '#4');
});
