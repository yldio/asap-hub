import { ResearchOutputResponse } from '@asap-hub/model';
import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { Card, Display } from '../atoms';
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

type SharedResearchOutputHeaderCardProps = ComponentProps<
  typeof SharedResearchMetadata
> &
  Pick<
    ResearchOutputResponse,
    | 'created'
    | 'addedDate'
    | 'authors'
    | 'teams'
    | 'labs'
    | 'title'
    | 'lastUpdatedPartial'
    | 'workingGroups'
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
  ...props
}) => (
  <Card>
    <SharedResearchMetadata {...props} workingGroups={workingGroups} />
    <Display styleAsHeading={3}>{title}</Display>
    <UsersList users={authors} />
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
        associations={workingGroups.map(({ id, title: displayName }) => ({
          id,
          displayName,
        }))}
      />
    </div>
    <div css={[timestampStyles, captionStyles]}>
      <span>Date added: {formatDate(new Date(addedDate || created))} · </span>
      <span>Last updated: {formatDate(new Date(lastUpdatedPartial))}</span>
    </div>
  </Card>
);

export default SharedResearchOutputHeaderCard;
