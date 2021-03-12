import React, { ComponentProps } from 'react';
import { Card, Headline2 } from '../atoms';
import RichText from './RichText';
import { ConditionalCollapsible } from '../molecules/Collapsible';

type RichTextCardProps = {
  readonly title: string;
  readonly text?: string | null;
  readonly collapsible?: ComponentProps<
    typeof ConditionalCollapsible
  >['condition'];
} & Pick<ComponentProps<typeof ConditionalCollapsible>, 'initiallyExpanded'>;
const RichTextCard: React.FC<RichTextCardProps> = ({
  title,
  text,
  collapsible,
  initiallyExpanded,
}) =>
  text ? (
    <Card>
      <Headline2 styleAsHeading={3}>{title}</Headline2>
      <ConditionalCollapsible
        condition={collapsible}
        initiallyExpanded={initiallyExpanded}
      >
        <RichText text={text} />
      </ConditionalCollapsible>
    </Card>
  ) : null;

export default RichTextCard;
