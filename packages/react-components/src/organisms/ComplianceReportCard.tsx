import { ComplianceReportResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { memo, useState } from 'react';
import {
  Button,
  minusRectIcon,
  plusRectIcon,
  Subtitle,
  Link,
  crnReportIcon,
  colors,
  ExternalLinkIcon,
  ExpandableText,
  Caption,
  formatDate,
  TextEditor,
} from '..';
import { paddingStyles } from '../card';
import UserTeamInfo from '../molecules/UserTeamInfo';
import { mobileScreen, perRem, rem } from '../pixels';
import { getTeams, getUserHref } from '../utils';

type ComplianceReportCardProps = ComplianceReportResponse;

const toastStyles = css({
  padding: `${24 / perRem}em ${15 / perRem}em `,
  borderRadius: `${rem(8)} ${rem(8)} 0 0`,
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${12 / perRem}em`,
});

const toastHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    alignItems: 'flex-start',
  },
});

const toastContentStyles = css({
  paddingLeft: `${60 / perRem}em`,
  paddingTop: rem(15),
});

const externalIconStyle = css({
  display: 'flex',
  alignSelf: 'center',
  gap: rem(8),
  paddingRight: rem(8),
  textWrap: 'nowrap',
});

const buttonStyles = css({
  width: rem(151),
  '> a': {
    height: rem(40),
  },
});

const addedByStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
});

const buttonsWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
});

const addedByContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  gap: rem(16),

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
  },
});

const addedByTextStyles = css({
  display: 'inline-flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  alignSelf: 'flex-end',
  gap: rem(2),

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
});

const titleContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: rem(16),

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: rem(8),
  },
});

const ComplianceReportCard: React.FC<ComplianceReportCardProps> = ({
  url,
  description,
  count,
  createdBy,
  createdDate,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div css={{ borderBottom: `1px solid ${colors.steel.rgb}` }}>
      <div css={toastStyles}>
        <span css={toastHeaderStyles}>
          <span css={[iconStyles]}>
            <Button
              aria-label={expanded ? 'Collapse Report' : 'Expand Report'}
              linkStyle
              onClick={() => setExpanded(!expanded)}
            >
              <span>{expanded ? minusRectIcon : plusRectIcon}</span>
            </Button>
          </span>
          <span css={[iconStyles]}>{crnReportIcon}</span>
          <div css={titleContainerStyles}>
            <Subtitle noMargin>Compliance Report #{count}</Subtitle>
            <div css={addedByContainerStyles}>
              <Caption accent="lead" noMargin>
                <div css={addedByStyles}>
                  <span css={addedByTextStyles}>
                    Date added:
                    <span>{formatDate(new Date(createdDate))}</span>
                  </span>
                  <span css={addedByTextStyles}>
                    Submitted by:
                    <UserTeamInfo
                      displayName={createdBy.displayName}
                      userHref={getUserHref(createdBy.id)}
                      teams={getTeams(createdBy.teams)}
                    />
                  </span>
                </div>
              </Caption>
            </div>
          </div>
        </span>
      </div>
      {expanded && (
        <div>
          <div css={[paddingStyles, toastContentStyles]}>
            <ExpandableText>
              <TextEditor
                id={`discussion-${createdBy.id}-${createdDate}`}
                value={description}
                enabled={false}
                isMarkdown
              />
            </ExpandableText>
            <div css={buttonsWrapperStyles}>
              <div css={buttonStyles}>
                <Link buttonStyle fullWidth small primary href={url}>
                  <span css={externalIconStyle}>
                    <ExternalLinkIcon /> View Report
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ComplianceReportCard, (prevProps, props) => {
  if (!prevProps) return true;

  return JSON.stringify(prevProps) === JSON.stringify(props);
});
