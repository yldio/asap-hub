import { ComponentProps } from 'react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';
import { css } from '@emotion/react';

import { Card, Anchor, Headline2, Caption } from '../atoms';
import { AssociationList, UsersList } from '../molecules';
import { formatDate } from '../date';
import { SharedResearchMetadata } from '.';
import { perRem } from '../pixels';

const associationStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: `${24 / perRem}em`,
  rowGap: `${12 / perRem}em`,
});

type SharedResearchCardProps = Pick<
  ResearchOutputResponse,
  | 'id'
  | 'created'
  | 'addedDate'
  | 'teams'
  | 'labs'
  | 'title'
  | 'authors'
  | 'type'
> &
  ComponentProps<typeof SharedResearchMetadata>;

const SharedResearchCard: React.FC<SharedResearchCardProps> = ({
  id: researchOutputId,
  created,
  addedDate,
  teams,
  title,
  authors,
  labs,
  ...props
}) => (
  <Card>
    <SharedResearchMetadata {...props} />
    <Anchor href={sharedResearch({}).researchOutput({ researchOutputId }).$}>
      <Headline2 styleAsHeading={4}>{title}</Headline2>
    </Anchor>
    <UsersList max={3} users={authors} />
    <div css={associationStyles}>
      <AssociationList
        type="Lab"
        inline
        max={1}
        associations={labs.map(({ id, name }) => ({ displayName: name, id }))}
      />
      <AssociationList type="Team" inline max={3} associations={teams} />
    </div>
    <Caption accent={'lead'} asParagraph>
      Date Added: {formatDate(new Date(addedDate))}
    </Caption>
  </Card>
);

export default SharedResearchCard;
