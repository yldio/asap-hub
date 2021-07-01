import { ComponentProps } from 'react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';
import { isEnabled } from '@asap-hub/flags';

import { Card, Anchor, Headline2, Caption } from '../atoms';
import { TeamsList, UsersList } from '../molecules';
import { formatDate } from '../date';
import { SharedResearchMetadata } from '.';

type SharedResearchCardProps = Pick<
  ResearchOutputResponse,
  'id' | 'created' | 'addedDate' | 'teams' | 'title' | 'authors'
> &
  ComponentProps<typeof SharedResearchMetadata>;

const SharedResearchCard: React.FC<SharedResearchCardProps> = ({
  id,
  created,
  addedDate,
  teams,
  title,
  authors,
  ...props
}) => (
  <Card>
    <SharedResearchMetadata {...props} />
    <Anchor
      href={sharedResearch({}).researchOutput({ researchOutputId: id }).$}
    >
      <Headline2 styleAsHeading={4}>{title}</Headline2>
    </Anchor>
    {isEnabled('RESEARCH_OUTPUT_SHOW_AUTHORS_LIST') && (
      <UsersList max={3} users={authors} />
    )}
    <TeamsList inline max={3} teams={teams} />
    <Caption accent={'lead'} asParagraph>
      Date Added: {formatDate(new Date(addedDate || created))}
    </Caption>
  </Card>
);

export default SharedResearchCard;
