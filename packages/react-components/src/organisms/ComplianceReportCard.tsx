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

const ComplianceReportCard: React.FC<ComplianceReportCardProps> = ({
  url,
  description,
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
          <Subtitle noMargin>Compliance Report</Subtitle>
        </span>
      </div>
      {expanded && (
        <div>
          <div css={[paddingStyles, toastContentStyles]}>
            <Markdown value={description}></Markdown>
            <div>
              <Link buttonStyle small primary href={url}>
                {externalLinkIcon} View Report
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceReportCard;
