import React from 'react';
import css from '@emotion/css';
import { Link } from '../atoms';
import { externalLinkIcon } from '../icons';
import { fern, pine } from '../colors';

const containerStyles = css({
  display: 'flex',
});
const styles = css({
  border: `1px solid ${fern.rgb}`,
  color: fern.rgb,
  borderRadius: '36px',
  boxSizing: 'border-box',
  display: 'flex',
  padding: '0 11px',
  margin: '12px 0',
  alignItems: 'center',
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
};
const ExternalLink: React.FC<ExternalLinkProps> = ({ href }) => (
  <div css={containerStyles}>
    <Link theme={null} href={href}>
      <div css={styles}>{externalLinkIcon} External Link</div>
    </Link>
  </div>
);

export default ExternalLink;
