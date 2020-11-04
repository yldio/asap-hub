import React from 'react';
import { TeamTool } from '@asap-hub/model';

import { Card, Headline3, Paragraph, Link } from '../atoms';

type ToolCardProps = Pick<TeamTool, 'description' | 'name' | 'url'> & {
  readonly href: string;
};
const ToolCard: React.FC<ToolCardProps> = ({
  name,
  description,
  href,
  url,
}) => (
  <Card>
    <Link href={url} theme={null}>
      <Headline3 styleAsHeading={4}>{name}</Headline3>
      <Paragraph accent="lead">{description}</Paragraph>
    </Link>
    <Link href={href}>Edit Link</Link>
  </Card>
);

export default ToolCard;
