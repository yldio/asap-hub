import { addHours, isBefore, parseISO } from 'date-fns';
import {
  BasicEvent,
  EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
} from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';

import { Divider, Headline2, Paragraph } from '../atoms';
import { RichText, TagList } from '..';
import { Collapsible } from '../molecules';
import { perRem } from '../pixels';

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
      <div
        css={{
          marginTop: `${12 / perRem}em`,
          marginBottom: `${24 / perRem}em`,
        }}
      >
        <Paragraph noMargin accent="lead">
          Explore keywords related to skills, techniques, resources, and tools.
        </Paragraph>
      </div>
      <TagList
        tags={tags.map((name) => ({
          tag: name,
          href: gp2Routing.tags({ tag: name }).$,
        }))}
      />
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
