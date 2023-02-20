import { Fragment } from 'react';

import { Card, Headline2 } from '../atoms';
import RichText from './SquidexRichText';
import { Collapsible } from '../molecules';

type RichTextCardProps = {
  readonly title: string;
  readonly text: string;
  readonly collapsible?: boolean;
};
const RichTextCard: React.FC<RichTextCardProps> = ({
  title,
  text,
  collapsible = false,
}) => {
  const Wrapper = collapsible ? Collapsible : Fragment;
  return (
    <Card>
      <Headline2 styleAsHeading={3}>{title}</Headline2>
      <Wrapper>
        <RichText text={text} />
      </Wrapper>
    </Card>
  );
};

export default RichTextCard;
