import { ResearchOutputResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { network } from '@asap-hub/routing';

import { Card, Display, StateTag } from '../atoms';
import { lead } from '../colors';
import { formatDate } from '../date';
import { perRem, mobileScreen } from '../pixels';
import { captionStyles } from '../text';
import { AssociationList, UsersList } from '../molecules';
import { SharedResearchMetadata } from '.';

const timestampStyles = css({
  color: lead.rgb,
  display: 'flex',
  flexDirection: 'row',
  whiteSpace: 'pre',
  marginTop: `${24 / perRem}em`,
  marginBottom: 0,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
    marginTop: `${12 / perRem}em`,
    marginBottom: `${12 / perRem}em`,
  },
});
const associationStyles = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: `${6 / perRem}em`,
});

const headerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingBottom: `${24 / perRem}em`,
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: `${15 / perRem}em`,
  },
});

type SharedResearchOutputHeaderCardProps = Pick<
  ResearchOutputResponse,
  | 'addedDate'
  | 'authors'
  | 'created'
  | 'documentType'
  | 'labs'
  | 'lastUpdatedPartial'
  | 'link'
  | 'teams'
  | 'title'
  | 'type'
  | 'workingGroups'
  | 'published'
  | 'reviewRequestedBy'
>;

const SharedResearchOutputHeaderCard: React.FC<
  SharedResearchOutputHeaderCardProps
> = ({
  created,
  addedDate,
  authors,
  teams,
  title,
  lastUpdatedPartial,
  labs,
  workingGroups,
  documentType,
  type,
  link,
  published,
  reviewRequestedBy,
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
    <span css={headerStyle}>
      <Display styleAsHeading={3}>{title}</Display>
      {!published && (
        <StateTag
          label={reviewRequestedBy ? 'In Review' : 'Draft'}
          accent={reviewRequestedBy ? 'blue' : undefined}
        />
      )}
    </span>

    <UsersList
      users={authors.map((author) => ({
        ...author,
        href: author.id && network({}).users({}).user({ userId: author.id }).$,
      }))}
    />
    <div css={associationStyles}>
      <AssociationList
        type="Lab"
        inline
        associations={labs.map(({ name, id }) => ({
          displayName: name,
          id,
        }))}
      />
      <AssociationList type="Team" inline associations={teams} />
      <AssociationList
        type="Working Group"
        inline
        associations={
          workingGroups
            ? workingGroups.map(({ id, title: displayName }) => ({
                id,
                displayName,
              }))
            : []
        }
      />
    </div>
    <div css={[timestampStyles, captionStyles]}>
      <span>Date added: {formatDate(new Date(addedDate || created))} · </span>
      <span>Last updated: {formatDate(new Date(lastUpdatedPartial))}</span>
    </div>
  </Card>
);

export default SharedResearchOutputHeaderCard;
