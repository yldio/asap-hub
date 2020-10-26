import React from 'react';

import { Card, Headline3, Paragraph, Button } from '../atoms';
import { noop } from '../utils';

type LinkCardProps = {
  readonly name: string;
  readonly description: string;
  readonly onClick?: () => void;
};
const LinkCard: React.FC<LinkCardProps> = ({
  name,
  description,
  onClick = noop,
}) => {
  return (
    <Card>
      <Headline3>{name}</Headline3>
      <Paragraph accent="lead">{description}</Paragraph>
      <Button linkStyle onClick={onClick}>
        Edit Link
      </Button>
    </Card>
  );
};

export default LinkCard;
