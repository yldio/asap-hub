import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import {
  largeDesktopScreen,
  mobileScreen,
  rem,
  tabletScreen,
  vminLinearCalc,
} from '../pixels';
import ResearchOutputsSearch from './ResearchOutputsSearch';

const styles = css({
  padding: `${rem(0)} calc(${rem(36)} + ${vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    30,
    'px',
  )}) 0`,
  [`@media (max-width: ${tabletScreen.max}px)`]: {
    padding: 0,
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
