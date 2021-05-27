import { ComponentProps } from 'react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';

import { Card, Anchor, Headline2, Caption } from '../atoms';
import { TeamsList } from '../molecules';
import { formatDate } from '../date';
import { SharedResearchMetadata } from '.';

type SharedResearchCardProps = Pick<
  ResearchOutputResponse,
  'id' | 'created' | 'addedDate' | 'teams' | 'title'
> &
  ComponentProps<typeof SharedResearchMetadata>;

const SharedResearchCard: React.FC<SharedResearchCardProps> = ({
  id,
  created,
  addedDate,
  teams,
  title,
  ...props
}) => (
  <Card>
    <SharedResearchMetadata {...props} />
    <Anchor
      href={sharedResearch({}).researchOutput({ researchOutputId: id }).$}
    >
      <Headline2 styleAsHeading={4}>{title}</Headline2>
    </Anchor>
    <TeamsList inline max={3} teams={teams} />
    <Caption accent={'lead'} asParagraph>
      Date Added: {formatDate(new Date(addedDate || created))}
    </Caption>
  </Card>
);

export default SharedResearchCard;
