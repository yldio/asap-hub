import { Paragraph } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import UserBiography from '../organisms/UserBiography';
import UserTags from '../organisms/UserTags';

type OnboardingBackgroundProps = Pick<
  ComponentProps<typeof UserBiography>,
  'biography'
> &
  Pick<ComponentProps<typeof UserTags>, 'tags'> & {
    editBiographyHref: string;
    editTagsHref: string;
  };
const OnboardingBackground: React.FC<OnboardingBackgroundProps> = ({
  biography,
  tags,
  editBiographyHref,
  editTagsHref,
}) => (
  <>
    <Paragraph noMargin>
      Next up, we’d like to capture some more information around your skills and
      experiences in order to help others to understand your areas of focus.
    </Paragraph>
    <UserTags tags={tags} editHref={editTagsHref} />
    <UserBiography biography={biography} editHref={editBiographyHref} />
  </>
);

export default OnboardingBackground;
