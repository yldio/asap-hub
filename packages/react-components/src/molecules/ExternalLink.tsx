import { css, Theme } from '@emotion/react';

import { Anchor } from '../atoms';
import { externalLinkIcon } from '../icons';
import { fern, pine } from '../colors';
import { mobileScreen, perRem } from '../pixels';
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
    height: '24px',
    width: 'max-content',
    minWidth: '24px',
    color: colors?.primary500?.rgba || fern.rgb,
    borderRadius: `${36 / perRem}em`,
    boxSizing: 'border-box',
    border: `${borderWidth}px solid ${colors?.primary500?.rgba || fern.rgb}`,
    margin: noMargin ? '0' : `${12 / perRem}em 0`,
    padding: withLabel ? `0 ${(12 - borderWidth) / perRem}em` : 0,
    [`@media (max-width: ${mobileScreen.max}px)`]: {
      padding: full ? `0 ${(12 - borderWidth) / perRem}em` : 0,
    },
    svg: {
      stroke: colors?.primary500?.rgba || fern.rgb,
      width: `${17.8 / perRem}em`,
      height: `${17.8 / perRem}em`,
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
    paddingTop: `${1 / perRem}em`,
    fontSize: `${13.6 / perRem}em`,
    [`@media (max-width: ${mobileScreen.max}px)`]: {
      display: full ? 'initial' : 'none',
    },
  });

type ExternalLinkProps = {
  readonly href: string;
  readonly icon?: JSX.Element;
  readonly label?: string;
  readonly noMargin?: boolean;
  readonly full?: boolean;
};
const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  icon = externalLinkIcon,
  label,
  noMargin = false,
  full = false,
}) => (
  <div css={containerStyles}>
    <Anchor href={href}>
      <span css={({ colors }) => styles(colors, !!label, noMargin, full)}>
        {icon}
        <span
          css={({ colors }) => [
            textStyles(full),
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
