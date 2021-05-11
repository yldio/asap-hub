import { researchOutputLabels, ResearchOutputResponse } from '@asap-hub/model';
import { useFlags } from '@asap-hub/react-context';
import { css } from '@emotion/react';

import { Card, TagLabel, ExternalLink, Display } from '..';
import { lead } from '../colors';
import { formatDate } from '../date';
import { perRem, mobileScreen } from '../pixels';
import { captionStyles } from '../text';
import { TeamsList, UsersList } from '../molecules';

const headerStyles = css({
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between',
});

const ROW_GAP_OFFSET = 6;

const typeContainerStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  listStyle: 'none',
  columnGap: `${12 / perRem}em`,
  margin: 0,
  marginTop: `${ROW_GAP_OFFSET / perRem}em`,
  padding: 0,
  alignItems: 'center',
  textTransform: 'capitalize',
});

const typeStyles = css({
  marginTop: `-${ROW_GAP_OFFSET / perRem}em`,
});

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

type SharedResearchOutputHeaderCardProps = Pick<
  ResearchOutputResponse,
  | 'created'
  | 'addedDate'
  | 'authors'
  | 'teams'
  | 'title'
  | 'type'
  | 'link'
  | 'lastModifiedDate'
  | 'subTypes'
>;

const SharedResearchOutputHeaderCard: React.FC<SharedResearchOutputHeaderCardProps> =
  ({
    created,
    addedDate,
    authors,
    teams,
    title,
    type,
    link,
    lastModifiedDate,
    subTypes,
  }) => {
    const { isEnabled } = useFlags();

    return (
      <Card>
        <div css={headerStyles}>
          <ul css={typeContainerStyles}>
            <li css={typeStyles}>
              <TagLabel>{type}</TagLabel>
            </li>
            {subTypes.map((subType, i) => (
              <li css={typeStyles} key={`subtype-${i}`}>
                <TagLabel>{subType}</TagLabel>
              </li>
            ))}
          </ul>
          {link ? (
            <ExternalLink label={researchOutputLabels[type]} href={link} />
          ) : null}
        </div>
        <Display styleAsHeading={3}>{title}</Display>
        {isEnabled('RESEARCH_OUTPUT_SHOW_AUTHORS_LIST') && (
          <UsersList users={authors} />
        )}
        <TeamsList inline teams={teams} />
        <div css={[timestampStyles, captionStyles]}>
          <span>
            Date added: {formatDate(new Date(addedDate || created))}
            {lastModifiedDate && ' · '}
          </span>
          {lastModifiedDate && (
            <span>Last updated: {formatDate(new Date(lastModifiedDate))}</span>
          )}
        </div>
      </Card>
    );
  };

export default SharedResearchOutputHeaderCard;
