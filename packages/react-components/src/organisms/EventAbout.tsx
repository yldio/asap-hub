import { addHours, isBefore, parseISO } from 'date-fns';
import {
  BasicEvent,
  EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
} from '@asap-hub/model';

import { Divider, Headline2, Paragraph } from '../atoms';
import { RichText, TagList } from '..';
import { Collapsible, ExpandableText } from '../molecules';
import { rem } from '../pixels';

type EventAboutProps = Pick<BasicEvent, 'description' | 'endDate'> & {
  tags: string[];
  variant?: 'collapsible' | 'expandable';
};

const EventAbout: React.FC<EventAboutProps> = ({
  tags,
  description,
  endDate,
  variant = 'collapsible',
}) => {
  const descriptionComponent = description ? (
    <div>
      <Headline2 styleAsHeading={4}>About this event</Headline2>
      {variant === 'expandable' ? (
        <ExpandableText variant="arrow">
          <RichText text={description} toc={false} />
        </ExpandableText>
      ) : (
        <Collapsible
          initiallyExpanded={isBefore(
            new Date(),
            addHours(
              parseISO(endDate),
              EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
            ),
          )}
        >
          <RichText text={description} toc={false} />
        </Collapsible>
      )}
    </div>
  ) : null;

  const tagsComponent = tags.length ? (
    <div>
      <Headline2 styleAsHeading={4}>Tags</Headline2>
      <div
        css={{
          marginTop: rem(12),
          marginBottom: rem(24),
        }}
      >
        <Paragraph noMargin accent="lead">
          Explore keywords related to skills, techniques, resources, and tools.
        </Paragraph>
      </div>
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
