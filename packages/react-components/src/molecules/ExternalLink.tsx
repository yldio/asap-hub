import React from 'react';
import css from '@emotion/css';

import { Anchor } from '../atoms';
import { externalLinkIcon } from '../icons';
import { fern, pine } from '../colors';
import { perRem } from '../pixels';

const containerStyles = css({
  display: 'flex',
});

const styles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '24px',
  width: 'max-content',
  minWidth: '24px',
  color: fern.rgb,
  borderRadius: `${36 / perRem}em`,
  boxSizing: 'border-box',
  border: `1px solid ${fern.rgb}`,
  margin: `${12 / perRem}em 0`,
  svg: {
    stroke: fern.rgb,
    width: `${17.8 / perRem}em`,
    height: `${17.8 / perRem}em`,
  },
  ':hover, :focus': {
    color: pine.rgb,
    borderColor: pine.rgb,
    svg: {
      stroke: pine.rgb,
    },
  },
});
const paddingStyles = css({ padding: `0 ${11 / perRem}em` });

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
    <Anchor href={href}>
      <div css={[styles, label !== '' && paddingStyles]}>
        {icon}
        <div css={textStyles}>{label}</div>
      </div>
    </Anchor>
  </div>
);

export default ExternalLink;
