import React from 'react';
import { PageControls } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Pagination / Page Controls',
  component: PageControls,
};

export const Normal = () => {
  const numPages = number('Number of Pages', 8, { min: 1 });
  const currentPage = number('Current Page Number', 4, {
    min: 1,
    max: numPages,
  });
  return (
    <PageControls
      numPages={numPages}
      currentIndex={currentPage - 1}
      renderPageHref={(index) => `#${index}`}
    />
  );
};
