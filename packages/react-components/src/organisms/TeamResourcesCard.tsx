import React from 'react';
import { css } from '@emotion/react';
import { TeamResponse } from '@asap-hub/model';
import { createMailTo } from '../mail';

import { Card, Headline2, Paragraph, Link } from '../atoms';
import { ExpandableText } from '../molecules';
import { googleDriveIcon } from '../icons';
import { fern, pine, steel, paper, colorWithTransparency } from '../colors';
import { rem } from '../pixels';

const cardStyles = css({
  padding: `${rem(32)} ${rem(24)}`,
});

const overviewStyles = css({
  display: 'flex',
  flexFlow: 'column',
  gap: rem(24),
});

const buttonsContainerStyles = css({
  display: 'flex',
  gap: rem(12),
  flexWrap: 'wrap',
  marginTop: rem(16),
});

const googleDriveButtonStyle = css({
  display: 'block',
  '> a': {
    borderRadius: rem(4),
    border: `1px solid ${steel.rgb}`,
    backgroundColor: paper.rgb,
    boxShadow: `0 2px 4px -2px ${colorWithTransparency(steel, 0.3).rgba}`,
    height: rem(40),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const primaryButtonStyle = css({
  display: 'block',
  '> a': {
    borderRadius: rem(4),
    border: `1px solid ${pine.rgb}`,
    backgroundColor: fern.rgb,
    boxShadow: `0 2px 4px -2px ${colorWithTransparency(pine, 0.25).rgba}`,
    height: rem(40),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type TeamResourcesCardProps = Pick<
  TeamResponse,
  | 'resourceTitle'
  | 'resourceDescription'
  | 'resourceButtonCopy'
  | 'resourceContactEmail'
  | 'resourceLink'
>;

const TeamResourcesCard: React.FC<TeamResourcesCardProps> = ({
  resourceTitle,
  resourceDescription,
  resourceButtonCopy,
  resourceContactEmail,
  resourceLink,
}) => {
  // Only show if at least one required field is populated
  if (
    !resourceTitle &&
    !resourceDescription &&
    !resourceButtonCopy &&
    !resourceContactEmail
  ) {
    return null;
  }

  return (
    <Card overrideStyles={cardStyles}>
      <div css={overviewStyles}>
        <Headline2 styleAsHeading={3} noMargin>
          {resourceTitle}
        </Headline2>

        {resourceDescription && (
          <ExpandableText variant="arrow">
            <Paragraph noMargin>{resourceDescription}</Paragraph>
          </ExpandableText>
        )}

        <div css={buttonsContainerStyles}>
          {resourceButtonCopy && resourceContactEmail && (
            <span css={primaryButtonStyle}>
              <Link
                buttonStyle
                primary
                href={createMailTo(resourceContactEmail)}
                noMargin
              >
                {resourceButtonCopy}
              </Link>
            </span>
          )}

          {resourceLink && (
            <span css={googleDriveButtonStyle}>
              <Link href={resourceLink} buttonStyle small noMargin>
                {googleDriveIcon} Access Drive
              </Link>
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TeamResourcesCard;
