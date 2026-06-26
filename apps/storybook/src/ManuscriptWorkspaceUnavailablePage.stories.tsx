import { ManuscriptWorkspaceUnavailablePage } from '@asap-hub/react-components';

import { CenterDecorator } from './layout';

export default {
  title: 'Templates / Manuscript Workspace Unavailable Page',
  component: ManuscriptWorkspaceUnavailablePage,
  decorators: [CenterDecorator],
};

export const Normal = () => <ManuscriptWorkspaceUnavailablePage />;
