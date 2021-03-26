import React from 'react';

import { Card, Headline2, Link, Paragraph } from '../atoms';
import { createMailTo } from '../mail';

const EventMaterialUnavailable: React.FC<Record<string, never>> = () => (
  <Card accent="placeholder">
    <Headline2 styleAsHeading={3}>
      No additional meeting materials available for this event
    </Headline2>
    <Paragraph accent="lead">
      If you have any questions about this event,{' '}
      <Link href={createMailTo('hub@asap.science')}>contact ASAP</Link> to learn
      more.
    </Paragraph>
  </Card>
);

export default EventMaterialUnavailable;
