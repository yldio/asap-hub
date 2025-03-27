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
import { getTeams, getUserHref } from './ManuscriptVersionCard';

type ComplianceReportCardProps = ComplianceReportResponse;

const toastStyles = css({
  padding: `${15 / perRem}em ${24 / perRem}em`,
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

const userContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: rem(8),
  paddingTop: rem(32),
});

const buttonsWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
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
          <Subtitle noMargin>Compliance Report #{count}</Subtitle>
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
            <Caption accent="lead" noMargin>
              <div css={userContainerStyles}>
                Date added:
                <span>{formatDate(new Date(createdDate))}</span>
                <span> · </span>
                Submitted by:
                <UserTeamInfo
                  displayName={createdBy.displayName}
                  userHref={getUserHref(createdBy.id)}
                  teams={getTeams(createdBy.teams)}
                />
              </div>
            </Caption>
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
