import React from 'react';
import { css } from '@emotion/react';

import * as colors from '../colors';
import { perRem } from '../pixels';
import { layoutStyles, AccentColorName } from '../text';

const commonStyles = css({
  ...layoutStyles,
  fontSize: `${18 / perRem}em`,
  lineHeight: `${24 / 18}em`,
  display: 'block',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

const linkStyles = css({
  textDecoration: 'underline',
});

interface Props {
  type: 'link' | 'text';
  children: string;
}

interface TextProps extends Props {
  type: 'text';
  accent?: AccentColorName;
}

interface LinkProps extends Props {
  type: 'link';
  href: string;
  openInNewTab?: boolean;
  accent?: AccentColorName;
}

const TextTitle: React.FC<TextProps> = ({ accent, children }) => (
  <span
    css={[commonStyles, accent ? { color: colors[accent].rgb } : null]}
    title={children}
  >
    {children}
  </span>
);

const LinkTitle: React.FC<LinkProps> = ({
  href,
  openInNewTab,
  accent,
  children,
}) => (
  <a
    css={[
      commonStyles,
      linkStyles,
      accent ? { color: colors[accent].rgb } : null,
    ]}
    href={href}
    target={openInNewTab ? '_blank' : '_self'}
    title={children}
  >
    {children}
  </a>
);

const Title: React.FC<TextProps | LinkProps> = ({
  children,
  type = 'text',
  ...props
}) =>
  type === 'link' ? (
    <LinkTitle {...(props as LinkProps)}>{children}</LinkTitle>
  ) : (
    <TextTitle {...(props as TextProps)}>{children}</TextTitle>
  );

export default Title;
