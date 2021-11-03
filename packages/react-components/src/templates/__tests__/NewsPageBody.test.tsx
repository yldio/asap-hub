import { render } from '@testing-library/react';
import { createNewsResponse } from '@asap-hub/fixtures';

import NewsPageBody from '../NewsPageBody';

it('renders multiple news cards', () => {
  const { getAllByRole } = render(
    <NewsPageBody
      news={[
        { ...createNewsResponse('1'), title: 'FirstNews' },
        { ...createNewsResponse('2'), title: 'SecondEvent' },
      ]}
    />,
  );
  expect(getAllByRole('heading').map(({ textContent }) => textContent)).toEqual(
    ['FirstNews', 'SecondEvent'],
  );
});
