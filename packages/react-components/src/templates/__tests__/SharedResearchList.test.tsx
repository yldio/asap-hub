import { ComponentProps } from 'react';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom';

import SharedResearchList from '../SharedResearchList';

const props: Omit<ComponentProps<typeof SharedResearchList>, 'children'> = {
  researchOutputs: createListResearchOutputResponse(2).items,
  listViewHref: '/list',
  cardViewHref: '/card',
  numberOfItems: 2,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: (index) => `#${index}`,
};

it('renders multiple shared outputs cards in card view', () => {
  const { queryAllByRole, getByRole } = render(
    <StaticRouter>
      <SharedResearchList {...props} isListView={false} />
    </StaticRouter>,
  );
  expect(getByRole('button').closest('span')).toHaveTextContent(/card/i);
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Output 1', 'Output 2']);
});

it('renders multiple research outputs in list view', () => {
  const { queryAllByRole, getByRole } = render(
    <StaticRouter>
      <SharedResearchList {...props} isListView />
    </StaticRouter>,
  );

  expect(getByRole('button').closest('span')).toHaveTextContent(/list/i);
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Output 1', 'Output 2']);
});
