import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { SharedResearchList } from '.';
import {
  perRem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
  tabletScreen,
} from '../pixels';

const styles = css({
  padding: `${24 / perRem}em calc(${36 / perRem}em + ${vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    30,
    'px',
  )})`,
  [`@media (max-width: ${tabletScreen.max}px)`]: {
    padding: `${24 / perRem}em 0`,
  },
});

const UserProfileResearchOutputs: React.FC<
  ComponentProps<typeof SharedResearchList>
> = ({ ...props }) => (
  <div css={styles}>
    <SharedResearchList {...props} />
  </div>
);

export default UserProfileResearchOutputs;
