import React from 'react';
import { render } from '@testing-library/react';

import ResearchOutputPage from '../ResearchOutputPage';

it('renders a proposal title and content', () => {
  const { getByText } = render(
    <ResearchOutputPage
      onClickBack={() => undefined}
      profileHref="#"
      title="title"
      type="proposal"
      created="2020-06-25T15:00:47.920Z"
      text="content"
    />,
  );
  expect(getByText(/proposal/i)).toBeVisible();
  expect(getByText(/title/i, { selector: 'h1' })).toBeVisible();
  expect(getByText(/content/i)).toBeVisible();
});
