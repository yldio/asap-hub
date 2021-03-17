import React, { Fragment } from 'react';

import { Card, Headline2 } from '../atoms';
import RichText from './RichText';
import { Collapsible } from '../molecules';

type RichTextCardProps = {
  readonly title: string;
  readonly text?: string | null;
  readonly collapsible?: boolean;
};
const RichTextCard: React.FC<RichTextCardProps> = ({
  title,
  text,
  collapsible = false,
}) => {
  const Wrapper = collapsible ? Collapsible : Fragment;
  return text ? (
    <Card>
      <Headline2 styleAsHeading={3}>{title}</Headline2>
      <Wrapper>
        <RichText text={text} />
      </Wrapper>
    </Card>
  ) : null;
};

export default RichTextCard;
