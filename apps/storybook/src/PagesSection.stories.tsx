import { PagesSection } from '@asap-hub/react-components';
import { createPageResponse } from '@asap-hub/fixtures';

import { number, text } from './knobs';

export default {
  title: 'Organisms / Pages Section',
};

export const Normal = () => (
  <PagesSection
    title={text('Title', 'Where to Start')}
    pages={Array.from(
      { length: number('Number of Pages', 2, { min: 0 }) },
      (_, idx) => createPageResponse(String(idx)),
    )}
  />
);
