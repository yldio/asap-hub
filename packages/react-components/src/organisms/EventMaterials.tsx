import React from 'react';
import css from '@emotion/css';
import { EventResponse } from '@asap-hub/model';

import { RichTextCard, AdditionalMaterials } from '.';
import { perRem } from '../pixels';
import { EventMaterialComingSoon } from '../molecules';

const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
});

type EventMaterialsProps = Pick<
  EventResponse,
  'notes' | 'videoRecording' | 'presentation' | 'meetingMaterials'
>;
const EventMaterials: React.FC<EventMaterialsProps> = ({
  notes = '',
  videoRecording = '',
  presentation = '',
  meetingMaterials,
}) => (
  <div css={cardsStyles}>
    {notes === '' ? (
      <EventMaterialComingSoon materialType="Notes" />
    ) : (
      <RichTextCard collapsible text={notes} title="Notes" />
    )}
    {videoRecording === '' ? (
      <EventMaterialComingSoon materialType="Video recording" />
    ) : (
      <RichTextCard text={videoRecording} title="Video recording" />
    )}
    {presentation === '' ? (
      <EventMaterialComingSoon materialType="Presentation" />
    ) : (
      <RichTextCard text={presentation} title="Presentation" />
    )}
    {meetingMaterials?.length === 0 ? (
      <EventMaterialComingSoon materialType="Additional meeting materials" />
    ) : (
      <AdditionalMaterials meetingMaterials={meetingMaterials} />
    )}
  </div>
);

export default EventMaterials;
