import { ComponentProps } from 'react';
import { ProjectOutputList } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';

import { number } from './knobs';

export default {
  title: 'Templates / Project Outputs / List',
};

const props = (): ComponentProps<typeof ProjectOutputList> => {
  const numberOfItems = number('Number of Outputs', 4, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;
  return {
    researchOutputs: createListResearchOutputResponse(numberOfItems)
      .items.slice(currentPageIndex * 10, currentPageIndex * 10 + 10)
      .map((output) => ({
        ...output,
        teams: [],
        projects: [
          { id: 'p1', title: 'Project Alpha', href: '/projects/p1' },
        ],
      })),
    numberOfItems,
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    renderPageHref: (index) => `#${index}`,
    exportResults: () => Promise.resolve(),
    listViewHref: '',
    cardViewHref: '',
  };
};

export const CardView = () => (
  <StaticRouter location="/">
    <ProjectOutputList {...props()} isListView={false} />
  </StaticRouter>
);
export const ListView = () => (
  <StaticRouter location="/">
    <ProjectOutputList {...props()} isListView />
  </StaticRouter>
);
