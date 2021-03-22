import React from 'react';

import { Card, Headline2, Paragraph } from '../atoms';
import { charcoal } from '../colors';

interface EventMaterialUnavailableProps {
  materialType:
    | 'Notes'
    | 'Video recording'
    | 'Presentation'
    | 'Additional meeting materials';
}

const plural: Record<EventMaterialUnavailableProps['materialType'], boolean> = {
  Notes: true,
  'Video recording': false,
  Presentation: false,
  'Additional meeting materials': true,
};

const EventMaterialUnavailable: React.FC<EventMaterialUnavailableProps> = ({
  materialType,
}) => (
  <Card accent="placeholder">
    <Headline2 styleAsHeading={3}>{materialType}</Headline2>
    <Paragraph accent="lead">
      There {plural[materialType] ? 'are' : 'is'}{' '}
      <strong css={{ color: charcoal.rgb }}>no {materialType} available</strong>{' '}
      for this event.
    </Paragraph>
  </Card>
);

export default EventMaterialUnavailable;
