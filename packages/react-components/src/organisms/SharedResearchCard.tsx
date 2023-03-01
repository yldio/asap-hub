import { ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';
import { css } from '@emotion/react';

import { Card, Caption } from '../atoms';
import { AssociationList, LinkHeadline, UsersList } from '../molecules';
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
  | 'addedDate'
  | 'authors'
  | 'created'
  | 'documentType'
  | 'id'
  | 'labs'
  | 'link'
  | 'teams'
  | 'title'
  | 'type'
  | 'workingGroups'
>;

const SharedResearchCard: React.FC<SharedResearchCardProps> = ({
  id: researchOutputId,
  created,
  addedDate,
  teams,
  title,
  authors,
  labs,
  workingGroups,
  type,
  documentType,
  link,
}) => (
  <Card>
    <SharedResearchMetadata
      pills={[
        workingGroups ? 'Working Group' : 'Team',
        ...(documentType ? [documentType] : []),
        ...(type ? [type] : []),
      ]}
      link={link}
    />
    <LinkHeadline
      level={2}
      styleAsHeading={4}
      href={sharedResearch({}).researchOutput({ researchOutputId }).$}
    >
      {title}
    </LinkHeadline>
    <UsersList max={3} users={authors} />
    <div css={associationStyles}>
      <AssociationList
        type="Lab"
        inline
        max={1}
        associations={labs.map(({ id, name }) => ({ displayName: name, id }))}
      />
      <AssociationList type="Team" inline max={3} associations={teams} />
      {workingGroups && (
        <AssociationList
          type="Working Group"
          inline
          max={3}
          associations={workingGroups.map(({ id, title: displayName }) => ({
            id,
            displayName,
          }))}
        />
      )}
    </div>
    <Caption accent={'lead'} asParagraph>
      Date Added: {formatDate(new Date(addedDate))}
    </Caption>
  </Card>
);

export default SharedResearchCard;
