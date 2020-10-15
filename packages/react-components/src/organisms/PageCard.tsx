import React from 'react';
import { PageResponse } from '@asap-hub/model';

import { Card, Headline2, Paragraph, Link } from '../atoms';

type PageCardProps = Pick<PageResponse, 'title' | 'text'> & {
  readonly href: string;
};

const PeopleCard: React.FC<PageCardProps> = ({ title, text, href }) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>{title}</Headline2>
      <Paragraph>{text}</Paragraph>
      <Link href={href}>Read more</Link>
    </Card>
  );
};

export default PeopleCard;
