import React from 'react';
import css from '@emotion/css';
import {
  EventResponse,
  EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
} from '@asap-hub/model';
import { addHours, parseISO } from 'date-fns';

import { RichTextCard, AdditionalMaterials } from '.';
import { perRem } from '../pixels';
import {
  EventMaterialComingSoon,
  EventMaterialUnavailable,
} from '../molecules';
import { useDateHasPassed } from '../date';

const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
});

type EventMaterialsProps = Pick<
  EventResponse,
  'endDate' | 'notes' | 'videoRecording' | 'presentation' | 'meetingMaterials'
>;
const EventMaterials: React.FC<EventMaterialsProps> = ({
  endDate,
  notes = '',
  videoRecording = '',
  presentation = '',
  meetingMaterials,
}) => {
  const hasEnded = useDateHasPassed(
    addHours(parseISO(endDate), EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT),
  );
  if (!hasEnded) {
    return null;
  }

  return (
    <div css={cardsStyles}>
      {notes === null ? (
        <EventMaterialUnavailable materialType="Notes" />
      ) : notes === '' ? (
        <EventMaterialComingSoon materialType="Notes" />
      ) : (
        <RichTextCard collapsible text={notes} title="Notes" />
      )}
      {videoRecording === null ? (
        <EventMaterialUnavailable materialType="Video recording" />
      ) : videoRecording === '' ? (
        <EventMaterialComingSoon materialType="Video recording" />
      ) : (
        <RichTextCard text={videoRecording} title="Video recording" />
      )}
      {presentation === null ? (
        <EventMaterialUnavailable materialType="Presentation" />
      ) : presentation === '' ? (
        <EventMaterialComingSoon materialType="Presentation" />
      ) : (
        <RichTextCard text={presentation} title="Presentation" />
      )}
      {meetingMaterials === null ? (
        <EventMaterialUnavailable materialType="Additional meeting materials" />
      ) : meetingMaterials?.length === 0 ? (
        <EventMaterialComingSoon materialType="Additional meeting materials" />
      ) : (
        <AdditionalMaterials meetingMaterials={meetingMaterials} />
      )}
    </div>
  );
};

export default EventMaterials;
