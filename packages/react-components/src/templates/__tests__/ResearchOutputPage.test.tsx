import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import ResearchOutputPage from '../ResearchOutputPage';

const props: ComponentProps<typeof ResearchOutputPage> = {
  backHref: '#',
  title: 'title',
  type: 'Proposal',
  created: '2020-06-25T15:00:47.920Z',
  text: 'content',
};
it('renders a proposal title and content', () => {
  const { getByText } = render(
    <ResearchOutputPage
      {...props}
      type="Proposal"
      title="title"
      text="content"
    />,
  );
  expect(getByText(/proposal/i)).toBeVisible();
  expect(getByText(/title/i, { selector: 'h1' })).toBeVisible();
  expect(getByText(/content/i)).toBeVisible();
});

it('renders a proposal with team information', () => {
  const { getByText } = render(
    <ResearchOutputPage
      {...props}
      team={{
        id: '42',
        displayName: 'Test',
      }}
    />,
  );
  expect(getByText('Team Test').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});
