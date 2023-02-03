import 'jest-playwright-preset';
import { render } from '@testing-library/react';
import domToPlaywright from 'dom-to-playwright';

import PageControls from '../PageControls';
import { textContentWithPseudo } from '../../test-utils';

const renderPageHref = (page: number) => `#${page}`;

afterEach(async () => {
  await jestPlaywright.resetPage();
});

it.each`
  description                                                                 | currentPage | numberOfPages | expected
  ${'renders the first, previous, current, next, and last page numbers'}      | ${5}        | ${9}          | ${'1 ... 4 5 6 ... 9'}
  ${'does not leave a gap of one page numbers'}                               | ${4}        | ${9}          | ${'1 2 3 4 5 ... 9'}
  ${'does not render duplicate page numbers when first and previous overlap'} | ${2}        | ${9}          | ${'1 2 3 ... 9'}
  ${'does not render negative page numbers on the first page'}                | ${1}        | ${9}          | ${'1 2 ... 9'}
  ${'deals with a single page'}                                               | ${1}        | ${1}          | ${'1'}
`('$description', async ({ numberOfPages, currentPage, expected }) => {
  const { getAllByText } = render(
    <PageControls
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage - 1}
      renderPageHref={renderPageHref}
    />,
  );
  const { select } = await domToPlaywright(page, document);

  const pageLinks = (
    await Promise.all(
      getAllByText(/\d+/).map((e) =>
        page.$eval(select(e.closest('li')!), textContentWithPseudo),
      ),
    )
  )
    .flat()
    .join(' ');

  expect(pageLinks).toBe(expected);
});
