import { render } from '@testing-library/react';
import { createNewsResponse } from '@asap-hub/fixtures';

import NewsPageBody from '../NewsPageBody';

it('renders multiple news cards', () => {
  const { getAllByRole } = render(
    <NewsPageBody
      news={[
        createNewsResponse({ key: 'id-1' }),
        createNewsResponse({ key: 'id-2' }),
      ]}
      numberOfPages={1}
      renderPageHref={(idx) => `${idx}`}
      currentPage={0}
      numberOfItems={4}
    />,
  );
  expect(getAllByRole('heading').map(({ textContent }) => textContent)).toEqual(
    ['id-1 title', 'id-2 title'],
  );
});
