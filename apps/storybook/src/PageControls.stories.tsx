import { PageControls } from '@asap-hub/react-components';
import { number } from './knobs';

export default {
  title: 'Molecules / Pagination / Page Controls',
  component: PageControls,
};

export const Normal = () => {
  const numberOfPages = number('Number of Pages', 8, { min: 1 });
  const currentPage = number('Current Page Number', 4, {
    min: 1,
    max: numberOfPages,
  });
  return (
    <PageControls
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage - 1}
      renderPageHref={(index) => `#${index}`}
    />
  );
};
