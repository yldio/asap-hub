import { UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { SharedResearchList } from '.';
import {
  rem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
  tabletScreen,
} from '../pixels';
import NoOutputsPage from './NoOutputsPage';

const styles = css({
  padding: `${rem(24)} calc(${rem(36)} + ${vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    30,
    'px',
  )})`,
  [`@media (max-width: ${tabletScreen.max}px)`]: {
    padding: `${rem(24)} 0`,
  },
});

export type UserProfileOutputsProps = Omit<
  ComponentProps<typeof SharedResearchList>,
  'children'
> &
  Pick<UserResponse, 'firstName'> & {
    ownUser: boolean;
    hasOutputs: boolean;
  };

const UserProfileResearchOutputs: React.FC<UserProfileOutputsProps> = ({
  hasOutputs,
  ownUser,
  firstName,
  ...props
}) => (
  <div css={styles}>
    {hasOutputs ? (
      <SharedResearchList {...props} />
    ) : (
      <NoOutputsPage
        {...(ownUser
          ? {
              title: 'You haven’t shared any research.',
              description:
                'To add research to your profile, contact your PM. In the meantime, try exploring research outputs shared by the network.',
            }
          : {
              title: `This member hasn’t shared any research.`,
              description:
                'It looks like this user has no shared outputs. In the meantime, try exploring research outputs shared by the network.',
            })}
      />
    )}
  </div>
);

export default UserProfileResearchOutputs;
