import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import SharedResearchGrantDocument from '../SharedResearchGrantDocument';

const props: ComponentProps<typeof SharedResearchGrantDocument> = {
  ...createResearchOutputResponse(),
  backHref: '#',
};
it('renders a proposal title and content', () => {
  const { getByText } = render(
    <SharedResearchGrantDocument
      {...props}
      type="Grant Document"
      title="title"
      description="content"
    />,
  );
  expect(getByText(/grant document/i)).toBeVisible();
  expect(getByText(/title/i, { selector: 'h1' })).toBeVisible();
  expect(getByText(/content/i)).toBeVisible();
});

it("renders a proposal with two team's information", () => {
  const { getByText } = render(
    <SharedResearchGrantDocument
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
    <SharedResearchGrantDocument
      {...props}
      created={new Date(2019, 1, 1, 1).toISOString()}
      addedDate={new Date(2020, 1, 1, 1).toISOString()}
    />,
  );
  expect(getByText(/2020/)).toBeVisible();
  rerender(
    <SharedResearchGrantDocument
      {...props}
      created={new Date(2019, 1, 1, 1).toISOString()}
      addedDate={undefined}
    />,
  );
  expect(getByText(/2019/)).toBeVisible();
});

it('displays contact pm card when there are contact emails', () => {
  const { queryByText, getByText, rerender } = render(
    <SharedResearchGrantDocument {...props} contactEmails={[]} />,
  );
  expect(queryByText(/contact pm/i)).not.toBeInTheDocument();
  rerender(
    <SharedResearchGrantDocument
      {...props}
      contactEmails={['blah@gmail.com']}
    />,
  );
  expect(getByText(/contact pm/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/blah/i),
  );
});
