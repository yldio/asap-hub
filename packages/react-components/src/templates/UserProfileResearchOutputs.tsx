import { isEnabled } from '@asap-hub/flags';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { SharedResearchList } from '.';
import { ComingSoon } from '..';
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
    {isEnabled('RESEARCH_OUTPUTS_ON_AUTHOR_PROFILE') ? (
      <SharedResearchList {...props} />
    ) : (
      <ComingSoon>
        As individuals create and share more research outputs - such as
        datasets, protocols, code and other resources - they will be listed
        here. As information is shared, teams should be mindful to respect
        intellectual boundaries. No investigator or team should act on any of
        the privileged information shared within the Network without express
        permission from and credit to the investigator(s) that shared the
        information.
      </ComingSoon>
    )}
  </div>
);
export default UserProfileResearchOutputs;
