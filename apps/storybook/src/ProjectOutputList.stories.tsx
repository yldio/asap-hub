import { ComponentProps } from 'react';
import { ProjectOutputList } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';
import type { ProjectOutput } from '@asap-hub/react-components';

import { number } from './knobs';

export default {
  title: 'Templates / Project Outputs / List',
};

const projectAlpha = {
  id: 'p1',
  title: 'Project Alpha',
  href: '/projects/discovery/p1',
};

const buildOutputs = (count: number): ProjectOutput[] =>
  createListResearchOutputResponse(count).items.map((output) => ({
    ...output,
    teams: [],
    projects: [projectAlpha],
  }));

const buildProps = (
  numberOfItems: number,
  currentPageIndex: number,
  pageSize: number,
): ComponentProps<typeof ProjectOutputList> => ({
  researchOutputs: buildOutputs(numberOfItems).slice(
    currentPageIndex * pageSize,
    currentPageIndex * pageSize + pageSize,
  ),
  numberOfItems,
  numberOfPages: Math.max(1, Math.ceil(numberOfItems / pageSize)),
  currentPageIndex,
  renderPageHref: (index) => `#${index}`,
  exportResults: () => Promise.resolve(),
  listViewHref: '?view=list',
  cardViewHref: '?view=card',
});

export const CardView = () => {
  const numberOfItems = number('Number of Outputs', 4, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;
  return (
    <StaticRouter location="/">
      <ProjectOutputList
        {...buildProps(numberOfItems, currentPageIndex, 10)}
        isListView={false}
      />
    </StaticRouter>
  );
};

export const ListView = () => {
  const numberOfItems = number('Number of Outputs', 8, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;
  return (
    <StaticRouter location="/">
      <ProjectOutputList
        {...buildProps(numberOfItems, currentPageIndex, 20)}
        isListView
      />
    </StaticRouter>
  );
};

export const Paginated = () => (
  <StaticRouter location="/">
    <ProjectOutputList {...buildProps(25, 0, 10)} isListView={false} />
  </StaticRouter>
);

export const SingleResult = () => (
  <StaticRouter location="/">
    <ProjectOutputList {...buildProps(1, 0, 10)} isListView={false} />
  </StaticRouter>
);

export const Empty = () => (
  <StaticRouter location="/">
    <ProjectOutputList {...buildProps(0, 0, 10)} isListView={false} />
  </StaticRouter>
);
