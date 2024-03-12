import { SharedResearchPage } from '@asap-hub/react-components';
import { LayoutDecorator } from './layout';

import { text } from './knobs';

export default {
  title: 'Templates / Shared Research / Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => (
  <SharedResearchPage
    searchQuery={text('Search Query', '')}
    filters={new Set()}
  >
    Page Content
  </SharedResearchPage>
);
