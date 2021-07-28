import { css } from '@emotion/react';

import { Anchor } from '../atoms';
import { externalLinkIcon } from '../icons';
import { fern, pine } from '../colors';
import { mobileScreen, perRem } from '../pixels';
import { themeStyles as linkStyles } from '../atoms/Link';

const containerStyles = css({
  display: 'flex',
});
const borderWidth = 1;
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
  border: `${borderWidth}px solid ${fern.rgb}`,
  margin: `${12 / perRem}em 0`,
  padding: `0 ${(12 - borderWidth) / perRem}em`,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    padding: 0,
  },
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

const textStyles = css({
  paddingTop: `${1 / perRem}em`,
  fontSize: `${13.6 / perRem}em`,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    display: 'none',
  },
});

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
      <div css={styles}>
        {icon}
        <div css={[textStyles, linkStyles.light]}>{label}</div>
      </div>
    </Anchor>
  </div>
);

export default ExternalLink;
