import { isBefore, addHours, parseISO } from 'date-fns';
import {
  BasicEvent,
  EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
} from '@asap-hub/model';

import { Headline2, Divider, Paragraph } from '../atoms';
import { TagList, RichText } from '..';
import { Collapsible } from '../molecules';

type EventAboutProps = Pick<BasicEvent, 'tags' | 'description' | 'endDate'>;

const EventAbout: React.FC<EventAboutProps> = ({
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
      <Headline2 styleAsHeading={4}>Tags</Headline2>
      <Paragraph>
        Explore keywords related to skills, techniques, resources, and tools.
      </Paragraph>
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
