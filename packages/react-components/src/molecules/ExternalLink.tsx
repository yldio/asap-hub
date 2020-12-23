import React from 'react';
import css from '@emotion/css';
import { Link } from '../atoms';
import { externalLinkIcon } from '../icons';
import { fern, pine } from '../colors';
import { perRem } from '../pixels';

const containerStyles = css({
  display: 'flex',
});
const styles = css({
  border: `1px solid ${fern.rgb}`,
  color: fern.rgb,
  borderRadius: `${36 / perRem}em`,
  boxSizing: 'border-box',
  display: 'flex',
  padding: `0 ${11 / perRem}em`,
  margin: `${12 / perRem}em 0`,
  alignItems: 'center',
  fontSize: `${13.6 / perRem}em`,
  svg: {
    stroke: fern.rgb,
  },
  ':hover, :focus': {
    color: pine.rgb,
    borderColor: pine.rgb,
    svg: {
      stroke: pine.rgb,
    },
  },
});

type ExternalLinkProps = {
  readonly href: string;
  readonly label?: string;
};
const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  label = 'External Link',
}) => (
  <div css={containerStyles}>
    <Link theme={null} href={href}>
      <div css={styles}>
        {externalLinkIcon} {label}
      </div>
    </Link>
  </div>
);

export default ExternalLink;
