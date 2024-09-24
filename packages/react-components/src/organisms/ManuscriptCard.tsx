import { TeamManuscript } from '@asap-hub/model';
import { css } from '@emotion/react';
import { useState } from 'react';
import { Button, colors, minusRectIcon, plusRectIcon, Subtitle } from '..';
import { mobileScreen, perRem, rem } from '../pixels';
import ManuscriptVersionCard from './ManuscriptVersionCard';

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

const ManuscriptCard: React.FC<ManuscriptCardProps> = ({ title, versions }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div css={manuscriptContainerStyles}>
      <div
        css={[
          { borderBottom: expanded ? `1px solid ${colors.steel.rgb}` : 'none' },
          toastStyles,
        ]}
      >
        <span css={toastHeaderStyles}>
          <span css={[iconStyles]}>
            <Button linkStyle onClick={() => setExpanded(!expanded)}>
              <span>{expanded ? minusRectIcon : plusRectIcon}</span>
            </Button>
          </span>
          <Subtitle noMargin>{title}</Subtitle>
        </span>
      </div>

      {expanded && (
        <div>
          {versions.map((version, index) => (
            <ManuscriptVersionCard {...version} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManuscriptCard;
