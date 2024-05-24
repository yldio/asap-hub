import { TeamManuscript } from '@asap-hub/model';
import { css } from '@emotion/react';
import { useState } from 'react';
import {
  Button,
  colors,
  minusRectIcon,
  Pill,
  plusRectIcon,
  Subtitle,
  article,
} from '..';
import { paddingStyles } from '../card';
import { mobileScreen, perRem, rem } from '../pixels';

type ManuscriptCardProps = Pick<TeamManuscript, 'id' | 'title' | 'versions'>;

const manuscriptContainerStyles = css({
  marginTop: rem(12),
  border: `1px solid ${colors.steel.rgb}`,
  borderRadius: `${rem(8)}`,
  boxSizing: 'border-box',
  width: '100%',
  borderWidth: 1,
  borderStyle: 'solid',
  display: 'block',
});

const toastStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${15 / perRem}em ${24 / perRem}em`,
  borderRadius: `${rem(8)} ${rem(8)} 0 0`,
  backgroundColor: colors.pearl.rgb,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
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

const ManuscriptCard: React.FC<ManuscriptCardProps> = ({ title, versions }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div css={manuscriptContainerStyles}>
      <span css={toastStyles}>
        <span css={toastHeaderStyles}>
          <span css={[iconStyles]}>
            <Button linkStyle onClick={() => setExpanded(!expanded)}>
              <span>{expanded ? minusRectIcon : plusRectIcon}</span>
            </Button>
          </span>
          <Subtitle noMargin>{title}</Subtitle>
        </span>
      </span>

      {expanded && (
        <div css={[paddingStyles, toastContentStyles]}>
          {versions.map(({ type, lifecycle }, index) => (
            <>
              <span css={toastHeaderStyles}>
                <span css={[iconStyles]}>{article}</span>
                <Subtitle noMargin>Manuscript</Subtitle>
              </span>
              <div
                style={{ display: 'flex', gap: rem(10), marginTop: rem(15) }}
                key={index}
              >
                <Pill accent="gray">{type}</Pill>
                <Pill accent="gray">{lifecycle}</Pill>
              </div>
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManuscriptCard;
