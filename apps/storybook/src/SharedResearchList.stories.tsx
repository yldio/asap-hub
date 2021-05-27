import { ComponentProps } from 'react';
import { SharedResearchList } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';
import { StaticRouter } from 'react-router-dom';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';

export default {
  title: 'Templates / Shared Research / List',
};

const props = (): ComponentProps<typeof SharedResearchList> => {
  const numberOfItems = number('Number of Outputs', 2, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;
  return {
    researchOutputs: createListResearchOutputResponse(
      numberOfItems,
    ).items.slice(currentPageIndex * 10, currentPageIndex * 10 + 10),
    numberOfItems,
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    renderPageHref: (index) => `#${index}`,
    listViewParams: '',
    cardViewParams: '',
  };
};

export const CardView = () => (
  <StaticRouter>
    <SharedResearchList {...props()} isListView={false} />
  </StaticRouter>
);
export const ListView = () => (
  <StaticRouter>
    <SharedResearchList {...props()} isListView />
  </StaticRouter>
);
