import React from 'react';

import { Card, Headline2, Paragraph } from '../atoms';
import { charcoal } from '../colors';

interface EventMaterialComingSoonProps {
  materialType:
    | 'Notes'
    | 'Video recording'
    | 'Presentation'
    | 'Additional meeting materials';
}
const EventMaterialComingSoon: React.FC<EventMaterialComingSoonProps> = ({
  materialType,
}) => (
  <Card accent="placeholder">
    <Headline2 styleAsHeading={3}>{materialType}</Headline2>
    <Paragraph accent="lead">
      {materialType} for this event will be coming soon - usually within a week
      after the event.{' '}
      <strong css={{ color: charcoal.rgb }}>Please check back later.</strong>
    </Paragraph>
  </Card>
);

export default EventMaterialComingSoon;
