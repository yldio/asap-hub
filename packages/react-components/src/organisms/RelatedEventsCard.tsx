import { ResearchOutputResponse, gp2 } from '@asap-hub/model';
import { events } from '@asap-hub/routing';
import { css } from '@emotion/react';
import React, { useState } from 'react';

import { Button, Card, Headline2, Link, Paragraph } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import { charcoal, lead, steel } from '../colors';
import { formatDateToTimezone } from '../date';

const container = css({
  display: 'grid',
  padding: `${32 / perRem}em ${24 / perRem}em`,
});

const descriptionStyles = css({
  marginTop: `${24 / perRem}em`,
  marginBottom: `${12 / perRem}em`,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    marginBottom: `${32 / perRem}em`,
  },
});

const gridTitleStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'inherit',
    paddingBottom: `${16 / perRem}em`,
  },
});

const rowTitleStyles = css({
  paddingTop: `${16 / perRem}em`,
  paddingBottom: `${16 / perRem}em`,
  ':first-of-type': { paddingTop: 0 },
  [`@media (min-width: ${tabletScreen.min}px)`]: { display: 'none' },
});

const gridStyles = css({
  display: 'grid',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: 'auto max-content',
    columnGap: `${15 / perRem}em`,
    rowGap: `${16 / perRem}em`,
  },
});

const underlineStyles = css({
  [`@media (max-width: ${tabletScreen.min}px)`]: {
    paddingBottom: `${16 / perRem}em`,
    '&:not(:last-child)': {
      borderBottom: `1px solid ${steel.rgb}`,
    },
  },
});

const paragraphStyle = css({
  marginTop: 0,
  marginBottom: 0,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: `${6 / perRem}em`,
  color: lead.rgb,
});

const showMoreStyles = css({
  display: 'flex',
  justifyContent: 'center',
  marginTop: `${32 / perRem}em`,
  paddingTop: `${16 / perRem}em`,
  paddingBottom: `${16 / perRem}em`,
  borderTop: `1px solid ${steel.rgb}`,
});

const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });

type RelatedEventsCardProps = (
  | Pick<ResearchOutputResponse, 'relatedEvents'>
  | Pick<gp2.OutputBaseResponse, 'relatedEvents'>
) & {
  truncateFrom?: number;
  hub?: 'GP2' | 'CRN';
};

const RelatedEventsCard: React.FC<RelatedEventsCardProps> = ({
  relatedEvents,
  truncateFrom = Number.POSITIVE_INFINITY,
  hub = 'CRN',
}) => {
  const [showMore, setShowMore] = useState(false);
  const displayShowMoreButton = relatedEvents.length > truncateFrom;
  return (
    <Card padding={false}>
      <div
        css={[
          container,
          ...(displayShowMoreButton ? [{ paddingBottom: 0 }] : []),
        ]}
      >
        <Headline2 noMargin>Related {hub} Hub Events</Headline2>
        <div css={descriptionStyles}>
          <Paragraph noMargin accent="lead">
            Find all events related to this output.
          </Paragraph>
        </div>
        {relatedEvents.length === 0 ? (
          <Paragraph noMargin accent="lead">
            <b>No related {hub} Hub events available.</b>
          </Paragraph>
        ) : (
          <div css={gridStyles}>
            <span css={[titleStyles, gridTitleStyles]}>Event Name</span>
            <span css={[titleStyles, gridTitleStyles]}>Date</span>
            {relatedEvents
              .slice(0, showMore ? undefined : truncateFrom)
              .map(({ id, endDate, title }, index) => (
                <React.Fragment key={`${index}-${id}`}>
                  <span css={[titleStyles, rowTitleStyles]}>Event Name</span>
                  <p css={paragraphStyle}>
                    <Link ellipsed href={events({}).event({ eventId: id }).$}>
                      {title}
                    </Link>
                  </p>
                  <span css={[titleStyles, rowTitleStyles]}>Date</span>
                  <p css={[paragraphStyle, underlineStyles]}>
                    {formatDateToTimezone(
                      endDate,
                      'EEE, dd MMM yyyy',
                    ).toUpperCase()}
                  </p>
                </React.Fragment>
              ))}
          </div>
        )}
      </div>
      {displayShowMoreButton && (
        <div css={showMoreStyles}>
          <Button linkStyle onClick={() => setShowMore(!showMore)}>
            View {showMore ? 'Less' : 'More'} Events
          </Button>
        </div>
      )}
    </Card>
  );
};

export default RelatedEventsCard;
