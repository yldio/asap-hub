import React from 'react';
import { isBefore, addHours, parseISO } from 'date-fns';
import {
  EventResponse,
  EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
} from '@asap-hub/model';

import { Headline2, Divider } from '../atoms';
import { TagList, RichText } from '..';
import { Collapsible } from '../molecules';

type EventInfoProps = Pick<EventResponse, 'tags' | 'description' | 'endDate'>;

const EventAbout: React.FC<EventInfoProps> = ({
  tags,
  description,
  endDate,
}) => {
  const descriptionComponent = description ? (
    <div>
      <Headline2 styleAsHeading={4}>About this event</Headline2>
      <Collapsible
        initiallyExpanded={isBefore(
          new Date(),
          addHours(parseISO(endDate), EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT),
        )}
      >
        <RichText text={description} toc={false} />
      </Collapsible>
    </div>
  ) : null;

  const tagsComponent = tags.length ? (
    <div>
      <Headline2 styleAsHeading={4}>Event tags</Headline2>
      <TagList tags={tags} />
    </div>
  ) : null;

  const dividerComponent =
    descriptionComponent && tagsComponent ? <Divider /> : null;

  return (
    <>
      {descriptionComponent}
      {dividerComponent}
      {tagsComponent}
    </>
  );
};

export default EventAbout;
