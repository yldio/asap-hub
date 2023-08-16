import { Paragraph } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import UserBiography from '../organisms/UserBiography';
import UserKeywords from '../organisms/UserKeywords';

type OnboardingBackgroundProps = Pick<
  ComponentProps<typeof UserBiography>,
  'biography'
> &
  Pick<ComponentProps<typeof UserKeywords>, 'tags'> & {
    editBiographyHref: string;
    editKeywordsHref: string;
  };
const OnboardingBackground: React.FC<OnboardingBackgroundProps> = ({
  biography,
  tags,
  editBiographyHref,
  editKeywordsHref,
}) => (
  <>
    <Paragraph noMargin>
      Next up, we’d like to capture some more information around your skills and
      experiences in order to help others to understand your areas of focus.
    </Paragraph>
    <UserKeywords tags={tags} editHref={editKeywordsHref} />
    <UserBiography biography={biography} editHref={editBiographyHref} />
  </>
);

export default OnboardingBackground;
