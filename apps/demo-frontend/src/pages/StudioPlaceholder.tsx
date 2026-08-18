/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';

import { Card, Headline } from '../ui/components';
import { lead, rem } from '../ui/theme';

const panelStyles = css({
  padding: rem(40),
  display: 'grid',
  gap: rem(8),
  justifyItems: 'start',
});

const StudioPlaceholder: FC<{ readonly title: string }> = ({ title }) => (
  <Card overrideStyles={panelStyles}>
    <Headline level={3}>{title}</Headline>
    <p css={{ color: lead.rgb, margin: 0 }}>Coming soon.</p>
  </Card>
);

export default StudioPlaceholder;
