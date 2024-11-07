import { ComplianceReportResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { useState } from 'react';
import {
  Button,
  minusRectIcon,
  plusRectIcon,
  Subtitle,
  Link,
  crnReportIcon,
  colors,
  externalLinkIcon,
  Markdown,
  ExpandableText,
} from '..';
import { paddingStyles } from '../card';
import { mobileScreen, perRem, rem } from '../pixels';

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

const ComplianceReportCard: React.FC<ComplianceReportCardProps> = ({
  url,
  description,
  count,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div css={{ borderBottom: `1px solid ${colors.steel.rgb}` }}>
      <div css={toastStyles}>
        <span css={toastHeaderStyles}>
          <span css={[iconStyles]}>
            <Button linkStyle onClick={() => setExpanded(!expanded)}>
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
              <Markdown value={description}></Markdown>
            </ExpandableText>
            <div css={buttonStyles}>
              <Link buttonStyle fullWidth small primary href={url}>
                <span css={externalIconStyle}>
                  {externalLinkIcon} View Report
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceReportCard;
