import { ComponentProps } from 'react';
import { number } from '@storybook/addon-knobs';
import { NewsPageBody } from '@asap-hub/react-components';
import { createNewsResponse } from '@asap-hub/fixtures';

export default {
  title: 'Templates / News / Page Body',
};

const props = (): ComponentProps<typeof NewsPageBody> => {
  const pageSize = number('Page size', 10, { min: 1, max: 10 });
  const numberOfItems = number('Number of News', 16, { min: 0 });
  const numberOfPages = Math.ceil(numberOfItems / pageSize);
  const currentPage =
    number('Current Page', 1, { min: 1, max: numberOfPages }) - 1;

  return {
    news: Array.from({ length: numberOfItems })
      .map((_, idx) => createNewsResponse({ key: `${idx + 1}` }))
      .slice(currentPage * pageSize, currentPage * pageSize + pageSize),
    renderPageHref: (index) => `#${index}`,
    numberOfItems,
    numberOfPages,
    currentPage,
  };
};

export const Normal = () => <NewsPageBody {...props()} />;
