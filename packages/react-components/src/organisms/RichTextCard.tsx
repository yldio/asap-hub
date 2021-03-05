import React from 'react';
import { Card, Headline2 } from '../atoms';
import RichText from './RichText';

interface RichTextCardProps {
  readonly title: string;
  readonly text?: string | null;
}
const RichTextCard: React.FC<RichTextCardProps> = ({ title, text }) =>
  text ? (
    <Card>
      <Headline2 styleAsHeading={3}>{title}</Headline2>
      <RichText text={text} />
    </Card>
  ) : null;

export default RichTextCard;
