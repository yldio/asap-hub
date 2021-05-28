import { ResearchOutputResponse } from '@asap-hub/model';
import { ComponentProps } from 'react';
import { useFlags } from '@asap-hub/react-context';
import { css } from '@emotion/react';

import { Card, Display } from '../atoms';
import { lead } from '../colors';
import { formatDate } from '../date';
import { perRem, mobileScreen } from '../pixels';
import { captionStyles } from '../text';
import { TeamsList, UsersList } from '../molecules';
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

type SharedResearchOutputHeaderCardProps = ComponentProps<
  typeof SharedResearchMetadata
> &
  Pick<
    ResearchOutputResponse,
    | 'created'
    | 'addedDate'
    | 'authors'
    | 'teams'
    | 'title'
    | 'lastUpdatedPartial'
  >;

const SharedResearchOutputHeaderCard: React.FC<SharedResearchOutputHeaderCardProps> =
  ({
    created,
    addedDate,
    authors,
    teams,
    title,
    lastUpdatedPartial,
    ...props
  }) => {
    const { isEnabled } = useFlags();

    return (
      <Card>
        <SharedResearchMetadata {...props} />
        <Display styleAsHeading={3}>{title}</Display>
        {isEnabled('RESEARCH_OUTPUT_SHOW_AUTHORS_LIST') && (
          <UsersList users={authors} />
        )}
        <TeamsList inline teams={teams} />
        <div css={[timestampStyles, captionStyles]}>
          <span>
            Date added: {formatDate(new Date(addedDate || created))} ·{' '}
          </span>
          <span>Last updated: {formatDate(new Date(lastUpdatedPartial))}</span>
        </div>
      </Card>
    );
  };

export default SharedResearchOutputHeaderCard;
