import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import SharedResearchProposal from '../SharedResearchProposal';

const props: ComponentProps<typeof SharedResearchProposal> = {
  ...createResearchOutputResponse(),
  backHref: '#',
};
it('renders a proposal title and content', () => {
  const { getByText } = render(
    <SharedResearchProposal
      {...props}
      type="Proposal"
      title="title"
      description="content"
    />,
  );
  expect(getByText(/proposal/i)).toBeVisible();
  expect(getByText(/title/i, { selector: 'h1' })).toBeVisible();
  expect(getByText(/content/i)).toBeVisible();
});

it('renders a proposal with team information', () => {
  const { getByText } = render(
    <SharedResearchProposal
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
