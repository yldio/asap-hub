import React from 'react';
import { TeamPage, TeamAbout } from '@asap-hub/react-components';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Team',
  decorators: [LayoutDecorator],
};

const commonProps = () => ({
  aboutHref: '/wrong',
  outputsHref: '/wrong',
});

export const AboutTab = () => (
  <TeamPage {...commonProps()} aboutHref="#">
    <TeamAbout></TeamAbout>
  </TeamPage>
);

export const OutputsTab = () => (
  <TeamPage {...commonProps()} outputsHref="#">
    Outputs
  </TeamPage>
);
