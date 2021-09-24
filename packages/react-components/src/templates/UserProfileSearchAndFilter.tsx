import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import {
  largeDesktopScreen,
  mobileScreen,
  perRem,
  tabletScreen,
  vminLinearCalc,
} from '../pixels';
import ResearchOutputsSearch from './ResearchOutputsSearch';

const styles = css({
  padding: `${24 / perRem}em calc(${36 / perRem}em + ${vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    30,
    'px',
  )}) 0`,
  [`@media (max-width: ${tabletScreen.max}px)`]: {
    padding: `${24 / perRem}em 0 0`,
  },
});

const UserProfileSearchAndFilter: React.FC<
  ComponentProps<typeof ResearchOutputsSearch>
> = ({ ...props }) => (
  <div css={styles}>
    <ResearchOutputsSearch {...props} />
  </div>
);
export default UserProfileSearchAndFilter;
