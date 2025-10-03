/** @jsxImportSource @emotion/react */
import { css, CSSObject, Theme } from '@emotion/react';

import { Anchor } from '../atoms';
import { ExternalLinkIcon } from '../icons';
import { fern, pine } from '../colors';
import { mobileScreen, rem } from '../pixels';
import { getLinkColors } from '../atoms/Link';

const containerStyles = css({
  display: 'flex',
});
const borderWidth = 1;
const styles = (
  colors: Theme['colors'],
  withLabel: boolean,
  noMargin: boolean,
  full: boolean,
) =>
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'max-content',
    borderRadius: rem(36),
    minWidth: '24px',
    color: colors?.primary500?.rgba || fern.rgb,
    boxSizing: 'border-box',
    border: `${borderWidth}px solid ${colors?.primary500?.rgba || fern.rgb}`,
    margin: noMargin ? '0' : `${rem(12)} 0`,
    padding: withLabel ? `0 ${rem(12 - borderWidth)}` : rem(3),
    [`@media (max-width: ${mobileScreen.max}px)`]: {
      padding: full ? `0 ${rem(12 - borderWidth)}` : rem(3),
    },
    svg: {
      stroke: colors?.primary500?.rgba || fern.rgb,
    },
    ':hover, :focus': {
      color: colors?.primary500?.rgba || pine.rgb,
      borderColor: colors?.primary500?.rgba || pine.rgb,
      svg: {
        stroke: colors?.primary500?.rgba || pine.rgb,
      },
    },
  });

const textStyles = (full: boolean) =>
  css({
    paddingTop: rem(1),
    [`@media (max-width: ${mobileScreen.max}px)`]: {
      display: full ? 'initial' : 'none',
    },
  });

export type SizeVariant = 'default' | 'large';

export const textSizes: Record<SizeVariant, CSSObject> = {
  default: {
    fontSize: rem(13.6),
  },
  large: {
    fontSize: rem(17),
  },
};

export const containerSizes: Record<SizeVariant, CSSObject> = {
  default: {
    height: '24px',
    svg: {
      width: rem(17.8),
      height: rem(17.8),
    },
  },
  large: {
    height: '24px',
    svg: {
      width: rem(24),
      height: rem(24),
    },
  },
};

type ExternalLinkProps = {
  readonly href: string;
  readonly icon?: JSX.Element;
  readonly label?: string;
  readonly noMargin?: boolean;
  readonly full?: boolean;
  readonly size?: SizeVariant;
};
const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  icon = <ExternalLinkIcon />,
  label,
  noMargin = false,
  full = false,
  size = 'default',
}) => (
  <div css={[containerStyles, containerSizes[size]]}>
    <Anchor href={href}>
      <span
        css={({ colors, components }) => [
          styles(colors, !!label, noMargin, full),
          components?.ExternalLink?.styles,
        ]}
      >
        {icon}
        <span
          css={({ colors }) => [
            textStyles(full),
            textSizes[size],
            getLinkColors(colors, 'light'),
          ]}
        >
          {label}
        </span>
      </span>
    </Anchor>
  </div>
);

export default ExternalLink;
