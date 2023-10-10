import { render } from '@testing-library/react';
import { createTutorialsResponse } from '@asap-hub/fixtures';

import TutorialsPageBody from '../TutorialsPageBody';

it('renders multiple tutorial cards', () => {
  const { getAllByRole } = render(
    <TutorialsPageBody
      tutorials={[
        createTutorialsResponse({ key: 'id-1' }),
        createTutorialsResponse({ key: 'id-2' }),
      ]}
      numberOfPages={1}
      renderPageHref={(idx) => `${idx}`}
      currentPage={0}
      numberOfItems={2}
    />,
  );
  expect(getAllByRole('heading').map(({ textContent }) => textContent)).toEqual(
    ['id-1 title', 'id-2 title'],
  );
});
