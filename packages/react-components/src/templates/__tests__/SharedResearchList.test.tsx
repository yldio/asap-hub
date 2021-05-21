import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom';

import SharedResearchList from '../SharedResearchList';

const props: Omit<ComponentProps<typeof SharedResearchList>, 'children'> = {
  researchOutputs: [
    {
      id: '1',
      title: 'Output 1',
      type: 'Proposal',
      addedDate: new Date().toISOString(),
      created: new Date().toISOString(),
      teams: [],
    },
    {
      id: '2',
      title: 'Output 2',
      type: 'Proposal',
      created: new Date().toISOString(),
      teams: [],
    },
  ],
  listViewParams: '',
  cardViewParams: '',
  numberOfItems: 2,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: (index) => `#${index}`,
};

it('renders multiple shared outputs cards in card view', () => {
  const { queryAllByRole, getByText } = render(
    <SharedResearchList {...props} isListView={false} />,
    {
      wrapper: StaticRouter,
    },
  );
  expect(
    getComputedStyle(getByText(/card/i, { selector: 'p' })).fontWeight,
  ).toBe('bold');
  expect(
    getComputedStyle(getByText(/list/i, { selector: 'p' })).fontWeight,
  ).toBe('');
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Output 1', 'Output 2']);
});

it('renders multiple research outputs in list view', () => {
  const { queryAllByRole, getByText } = render(
    <SharedResearchList {...props} isListView />,
    {
      wrapper: StaticRouter,
    },
  );
  expect(
    getComputedStyle(getByText(/card/i, { selector: 'p' })).fontWeight,
  ).toBe('');
  expect(
    getComputedStyle(getByText(/list/i, { selector: 'p' })).fontWeight,
  ).toBe('bold');
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Output 1', 'Output 2']);
});
