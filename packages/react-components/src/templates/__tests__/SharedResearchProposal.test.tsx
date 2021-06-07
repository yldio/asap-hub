import { ComponentProps } from 'react';
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

it("renders a proposal with two team's information", () => {
  const { getByText } = render(
    <SharedResearchProposal
      {...props}
      teams={[
        {
          id: '42',
          displayName: 'Test',
        },
        {
          id: '43',
          displayName: 'second',
        },
      ]}
    />,
  );
  expect(getByText('Team Test').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
  expect(getByText('Team second').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/43$/),
  );
});
it('falls back to created date when added date omitted', () => {
  const { getByText, rerender } = render(
    <SharedResearchProposal
      {...props}
      created={new Date(2019, 1, 1, 1).toISOString()}
      addedDate={new Date(2020, 1, 1, 1).toISOString()}
    />,
  );
  expect(getByText(/2020/)).toBeVisible();
  rerender(
    <SharedResearchProposal
      {...props}
      created={new Date(2019, 1, 1, 1).toISOString()}
      addedDate={undefined}
    />,
  );
  expect(getByText(/2019/)).toBeVisible();
});
