import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { useFlags } from '@asap-hub/react-context';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ComponentProps } from 'react';

import UserProfileResearchOutputs from '../UserProfileResearchOutputs';

const baseProps: ComponentProps<typeof UserProfileResearchOutputs> = {
  researchOutputs: [],
  numberOfItems: 0,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: () => '',
  isListView: false,
  cardViewHref: '',
  listViewHref: '',
};
it('renders a coming soon text (REGRESSION)', () => {
  const {
    result: { current },
  } = renderHook(useFlags);
  current.disable('RESEARCH_OUTPUTS_ON_AUTHOR_PROFILE');
  const { getByText } = render(<UserProfileResearchOutputs {...baseProps} />);

  expect(getByText(/more\sto\scome/i)).toBeVisible();
  expect(getByText(/research\soutputs/i)).toBeVisible();
});

it('renders output cards', () => {
  const { getAllByRole, queryByText } = render(
    <UserProfileResearchOutputs
      {...baseProps}
      researchOutputs={[
        {
          ...createResearchOutputResponse(),
          id: 'uuid-output',
          title: 'Title',
          authors: [],
          teams: [
            {
              id: 'uuid-team',
              displayName: 'Unknown',
            },
          ],
        },
      ]}
      numberOfItems={1}
    />,
  );

  const links = getAllByRole('link');
  expect(links).toHaveLength(2);
  const [titleLink, teamLink] = links;

  expect(titleLink).toHaveTextContent('Title');
  expect(teamLink).toHaveTextContent(/Unknown/);

  expect(titleLink).toHaveAttribute(
    'href',
    expect.stringMatching(/uuid-output$/),
  );
  expect(teamLink).toHaveAttribute('href', expect.stringMatching(/uuid-team$/));

  expect(queryByText(/more\sto\scome/i)).not.toBeInTheDocument();
});
