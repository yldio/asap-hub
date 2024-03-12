import { NoOutputsPage } from '@asap-hub/react-components';
import { text } from './knobs';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / No Outputs Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => (
  <NoOutputsPage
    title={text('Title', 'Your team hasn’t shared any research.')}
    description={text(
      'Description',
      'To start sharing research, contact your PM. In the meantime, try exploring research outputs shared by the network.',
    )}
  />
);
