import { gp2 as gp2Model } from '@asap-hub/model';
import { Paragraph } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { ComponentProps } from 'react';
import { UserDetailHeaderCard } from '../organisms';

import UserContactInformation from '../organisms/UserContactInformation';

type OnboardingCoreDetailProps = Pick<
  gp2Model.UserResponse,
  'email' | 'alternativeEmail'
> &
  ComponentProps<typeof UserDetailHeaderCard>;

const { onboarding } = gp2Routing;

const OnboardingCoreDetails: React.FC<OnboardingCoreDetailProps> = ({
  email,
  alternativeEmail,
  onImageSelect,
  ...headerProps
}) => (
  <>
    <Paragraph noMargin>
      In order to join the platform, we need to capture some core information
      before you start exploring.
    </Paragraph>
    <UserDetailHeaderCard
      {...headerProps}
      editHref={onboarding({}).coreDetails({}).editKeyInfo({}).$}
      onImageSelect={onImageSelect}
    />
    <UserContactInformation
      editHref={onboarding({}).coreDetails({}).editContactInfo({}).$}
      alternativeEmail={alternativeEmail}
      email={email}
    />
  </>
);

export default OnboardingCoreDetails;
