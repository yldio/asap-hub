import { css } from '@emotion/react';
import { TutorialsResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { Card, Display } from '../atoms';
import { perRem, mobileScreen } from '../pixels';
import { formatDate } from '../date';
import { ExternalLink, UsersList, AssociationList } from '../molecules';
import { lead } from '..';
import { captionStyles } from '../text';

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

const headerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  paddingBottom: `${24 / perRem}em`,
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: `${15 / perRem}em`,
  },
});

const associationStyles = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: `${6 / perRem}em`,
});

type TutorialHeaderCardProps = Pick<
  TutorialsResponse,
  | 'authors'
  | 'created'
  | 'lastUpdated'
  | 'link'
  | 'linkText'
  | 'teams'
  | 'title'
>;

const TutorialHeaderCard: React.FC<TutorialHeaderCardProps> = ({
  title,
  link,
  linkText,
  created,
  lastUpdated,
  authors,
  teams,
}) => (
  <Card>
    <div css={headerStyle}>
      <div css={{ paddingRight: `${15 / perRem}em` }}>
        <Display styleAsHeading={3}>{title}</Display>
      </div>
      {link ? <ExternalLink label={linkText} href={link} /> : null}
    </div>
    <UsersList
      users={authors.map((author) => ({
        ...author,
        href: author.id && network({}).users({}).user({ userId: author.id }).$,
      }))}
    />
    <div css={associationStyles}>
      <AssociationList type="Team" inline associations={teams} />
    </div>
    <div css={[timestampStyles, captionStyles]}>
      <span>Date added: {formatDate(new Date(created))}</span>
      {lastUpdated && (
        <span> . Last updated: {formatDate(new Date(lastUpdated))}</span>
      )}
    </div>
  </Card>
);

export default TutorialHeaderCard;
