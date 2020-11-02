import React from 'react';
import { TeamTool } from '@asap-hub/model';

import { Card, Headline3, Paragraph, Link } from '../atoms';

type LinkCardProps = Pick<TeamTool, 'description' | 'name'> & {
  readonly href: string;
};
const LinkCard: React.FC<LinkCardProps> = ({ name, description, href }) => (
  <Card>
    <Headline3>{name}</Headline3>
    <Paragraph accent="lead">{description}</Paragraph>
    <Link href={href}>Edit Link</Link>
  </Card>
);

export default LinkCard;
