import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SharedResearchPageBody from '../SharedResearchPageBody';

const props: Omit<ComponentProps<typeof SharedResearchPageBody>, 'children'> = {
  researchOutputs: [
    {
      id: '1',
      title: 'Output 1',
      type: 'Proposal',
      publishDate: new Date().toISOString(),
      created: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Output 2',
      type: 'Proposal',
      publishDate: new Date().toISOString(),
      created: new Date().toISOString(),
    },
  ],
  listViewParams: '',
  detailsViewParams: '',
  numberOfItems: 2,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: (index) => `#${index}`,
};

it('renders multiple library cards', () => {
  const { queryAllByRole } = render(<SharedResearchPageBody {...props} />);
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Output 1', 'Output 2']);
});
