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
  display: 'flex',
  alignItems: 'center',
  color: fern.rgb,
  height: '24px',
  borderRadius: `${36 / perRem}em`,
  boxSizing: 'border-box',
  border: `1px solid ${fern.rgb}`,
  padding: `0 ${11 / perRem}em`,
  margin: `${12 / perRem}em 0`,
  svg: {
    stroke: fern.rgb,
    width: '17.8px',
    height: '17.8px',
  },
  ':hover, :focus': {
    color: pine.rgb,
    borderColor: pine.rgb,
    svg: {
      stroke: pine.rgb,
    },
  },
});

const textStyles = css({ paddingTop: '1px', fontSize: `${13.6 / perRem}em` });

type ExternalLinkProps = {
  readonly href: string;
  readonly icon?: JSX.Element;
  readonly label?: string;
};
const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  icon = externalLinkIcon,
  label = 'External Link',
}) => (
  <div css={containerStyles}>
    <Link theme={null} href={href}>
      <div css={styles}>
        {icon}
        <div css={textStyles}>{label}</div>
      </div>
    </Link>
  </div>
);

export default ExternalLink;
