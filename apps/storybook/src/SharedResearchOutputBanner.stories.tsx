import { SharedResearchOutputBanner } from '@asap-hub/react-components';
import { boolean, select, text } from '@storybook/addon-knobs';

import { LayoutDecorator } from './layout';

export default {
  title: 'Molecules / Shared Research / Banner',
  decorators: [LayoutDecorator],
};

export const Normal = () => (
  <SharedResearchOutputBanner
    published={boolean('Published', true)}
    isPublishedNow={boolean('Is Published Now', true)}
    documentType={text('Document Type', 'Article')}
    association={select(
      'Association',
      ['team', 'teams', 'working group'],
      'team',
    )}
  />
);
