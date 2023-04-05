import { render, RenderResult } from '@testing-library/react';
import {
  mockConsoleError,
  findParentWithStyle,
} from '@asap-hub/dom-test-utils';
import fc from 'fast-check';

import PageControls from '../PageControls';
import { fern, tin } from '../../colors';

mockConsoleError();

const renderPageHref = (page: number) => `#${page}`;

it('rejects a negative index', () => {
  expect(() =>
    render(
      <PageControls
        numberOfPages={1}
        currentPageIndex={-1}
        renderPageHref={renderPageHref}
      />,
    ),
  ).toThrow(/index.+-1/i);
});

it('rejects an index beyond the existing pages', () => {
  expect(() =>
    render(
      <PageControls
        numberOfPages={1}
        currentPageIndex={1}
        renderPageHref={renderPageHref}
      />,
    ),
  ).toThrow(/index.+1/i);
});

describe('the arrow controls', () => {
  it('contain a link to the first page', () => {
    const { getByTitle } = render(
      <PageControls
        numberOfPages={3}
        currentPageIndex={2}
        renderPageHref={renderPageHref}
      />,
    );
    expect(
      findParentWithStyle(getByTitle(/first page/i), 'stroke')?.stroke?.replace(
        / /g,
        '',
      ),
    ).toBe(fern.rgba.replace(/ /g, ''));
    expect(getByTitle(/first page/i).closest('a')).toHaveAttribute(
      'href',
      '#0',
    );
  });
  it('disable the link to the first page on the first page', () => {
    const { getByTitle } = render(
      <PageControls
        numberOfPages={3}
        currentPageIndex={0}
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
        numberOfPages={3}
        currentPageIndex={2}
        renderPageHref={renderPageHref}
      />,
    );
    expect(
      findParentWithStyle(
        getByTitle(/previous page/i),
        'stroke',
      )?.stroke?.replace(/ /g, ''),
    ).toBe(fern.rgba.replace(/ /g, ''));
    expect(getByTitle(/previous page/i).closest('a')).toHaveAttribute(
      'href',
      '#1',
    );
  });
  it('disable the link to the previous page on the first page', () => {
    const { getByTitle } = render(
      <PageControls
        numberOfPages={3}
        currentPageIndex={0}
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
        numberOfPages={3}
        currentPageIndex={0}
        renderPageHref={renderPageHref}
      />,
    );
    expect(
      findParentWithStyle(getByTitle(/next page/i), 'stroke')?.stroke?.replace(
        / /g,
        '',
      ),
    ).toBe(fern.rgba.replace(/ /g, ''));
    expect(getByTitle(/next page/i).closest('a')).toHaveAttribute('href', '#1');
  });
  it('disable the link to the next page on the last page', () => {
    const { getByTitle } = render(
      <PageControls
        numberOfPages={3}
        currentPageIndex={2}
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
        numberOfPages={3}
        currentPageIndex={0}
        renderPageHref={renderPageHref}
      />,
    );
    expect(
      findParentWithStyle(getByTitle(/last page/i), 'stroke')?.stroke?.replace(
        / /g,
        '',
      ),
    ).toBe(fern.rgba.replace(/ /g, ''));
    expect(getByTitle(/last page/i).closest('a')).toHaveAttribute('href', '#2');
  });
  it('disable the link to the last page on the last page', () => {
    const { getByTitle } = render(
      <PageControls
        numberOfPages={3}
        currentPageIndex={2}
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

describe('the page numbers', () => {
  const numPagesAndCurrPageIndex = fc
    .tuple(fc.integer(1, 100), fc.integer(0, 99))
    .filter(([numPages, currPageIndex]) => numPages !== currPageIndex)
    .map(([numPages, currPageIndex]) =>
      numPages > currPageIndex
        ? [numPages, currPageIndex]
        : [currPageIndex, numPages],
    );

  let result!: RenderResult;
  beforeEach(() => {
    result = render(
      <PageControls
        numberOfPages={1}
        currentPageIndex={0}
        renderPageHref={renderPageHref}
      />,
    );
  });

  it('always include the first page', async () => {
    fc.assert(
      fc.property(
        numPagesAndCurrPageIndex,
        ([numberOfPages, currentPageIndex]) => {
          result.rerender(
            <PageControls
              numberOfPages={numberOfPages!}
              currentPageIndex={currentPageIndex!}
              renderPageHref={renderPageHref}
            />,
          );
          expect(result.getByText('1', { exact: true })).toBeVisible();
        },
      ),
      { interruptAfterTimeLimit: 500 },
    );
  });

  it('always include the last page', async () => {
    fc.assert(
      fc.property(
        numPagesAndCurrPageIndex,
        ([numberOfPages, currentPageIndex]) => {
          result.rerender(
            <PageControls
              numberOfPages={numberOfPages!}
              currentPageIndex={currentPageIndex!}
              renderPageHref={renderPageHref}
            />,
          );
          expect(
            result.getByText(String(numberOfPages), { exact: true }),
          ).toBeVisible();
        },
      ),
      { interruptAfterTimeLimit: 500 },
    );
  });

  it('always include the current page', async () => {
    fc.assert(
      fc.property(
        numPagesAndCurrPageIndex,
        ([numberOfPages, currentPageIndex]) => {
          result.rerender(
            <PageControls
              numberOfPages={numberOfPages!}
              currentPageIndex={currentPageIndex!}
              renderPageHref={renderPageHref}
            />,
          );
          expect(
            result.getByText(String(currentPageIndex! + 1), { exact: true }),
          ).toBeVisible();
        },
      ),
      { interruptAfterTimeLimit: 500 },
    );
  });
});

it('highlights the active page number', () => {
  const { getByText } = render(
    <PageControls
      numberOfPages={9}
      currentPageIndex={5 - 1}
      renderPageHref={renderPageHref}
    />,
  );
  expect(getComputedStyle(getByText('4')).color).not.toBe(fern.rgb);
  expect(getComputedStyle(getByText('5')).color).toBe(fern.rgb);
});

it('links page numbers to the respective pages', () => {
  const { getByText } = render(
    <PageControls
      numberOfPages={9}
      currentPageIndex={5 - 1}
      renderPageHref={renderPageHref}
    />,
  );
  expect(getByText('4').closest('a')).toHaveAttribute('href', '#3');
  expect(getByText('5').closest('a')).toHaveAttribute('href', '#4');
});
