import React from 'react';
import { Collapsible, Paragraph } from '@asap-hub/react-components';

export default {
  title: 'Molecules / CochevronCircleDownIcon',
  component: Collapsible,
};

export const InitiallyCollapsed = () => (
  <Collapsible>
    <Paragraph>Content</Paragraph>
  </Collapsible>
);
export const InitiallyExpanded = () => (
  <Collapsible initiallyExpanded>
    <Paragraph>Content</Paragraph>
  </Collapsible>
);
