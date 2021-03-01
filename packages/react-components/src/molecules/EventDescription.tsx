import React from 'react';
import { EventResponse } from '@asap-hub/model';
import TagList from './TagList';
import { RichText } from '../organisms';
import { Headline2, Divider } from '../atoms';

type EventInfoProps = Pick<EventResponse, 'tags' | 'description'>;

const EventDescription: React.FC<EventInfoProps> = ({ tags, description }) => {
  const descriptionComponent = description ? (
    <div>
      <Headline2 styleAsHeading={4}>About this event</Headline2>
      <RichText text={description} toc={false} />
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

export default EventDescription;
