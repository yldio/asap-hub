import React from 'react';
import { researchOutputLabels, ResearchOutputResponse } from '@asap-hub/model';
import css from '@emotion/css';

import { Card, TagLabel, ExternalLink, Display } from '..';
import { lead } from '../colors';
import { formatDate } from '../date';
import { perRem, mobileScreen } from '../pixels';
import { captionStyles } from '../text';

const headerStyles = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const typeStyles = css({
  display: 'flex',
  alignItems: 'center',
  textTransform: 'capitalize',
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
  | 'teams'
  | 'title'
  | 'type'
  | 'link'
  | 'lastModifiedDate'
>;

const SharedResearchOutputHeaderCard: React.FC<SharedResearchOutputHeaderCardProps> = ({
  created,
  addedDate,
  teams,
  title,
  type,
  link,
  lastModifiedDate,
}) => (
  <Card>
    <div css={headerStyles}>
      <div css={typeStyles}>
        <TagLabel>{type}</TagLabel>
      </div>
      {link ? (
        <ExternalLink label={researchOutputLabels[type]} href={link} />
      ) : null}
    </div>
    <Display styleAsHeading={3}>{title}</Display>
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

export default SharedResearchOutputHeaderCard;
