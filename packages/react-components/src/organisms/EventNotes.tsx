import React from 'react';
import { Card, Headline2 } from '../atoms';
import RichText from './RichText';

interface EventNotesProps {
  readonly notes?: string;
}
const EventNotes: React.FC<EventNotesProps> = ({ notes }) =>
  notes ? (
    <Card>
      <Headline2 styleAsHeading={3}>Meeting materials</Headline2>
      <RichText text={notes} />
    </Card>
  ) : null;

export default EventNotes;
