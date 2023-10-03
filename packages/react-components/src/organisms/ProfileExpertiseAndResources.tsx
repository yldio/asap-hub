import { useContext } from 'react';
import { UserProfileContext } from '@asap-hub/react-context';

import { Card, Divider, Headline2, Paragraph } from '../atoms';
import { TagList } from '../molecules';
import UserProfilePlaceholderCard from './UserProfilePlaceholderCard';
import { perRem } from '../pixels';

type ProfileExpertiseAndResourcesProps = {
  readonly expertiseAndResourceTags: string[];
  readonly expertiseAndResourceDescription?: string;
  readonly hideExpertiseAndResources?: boolean;
};

const ProfileExpertiseAndResources: React.FC<
  ProfileExpertiseAndResourcesProps
> = ({
  expertiseAndResourceTags,
  expertiseAndResourceDescription,
  hideExpertiseAndResources,
}) => {
  const { isOwnProfile } = useContext(UserProfileContext);
  return expertiseAndResourceTags.length || isOwnProfile ? (
    <Card>
      {!hideExpertiseAndResources && (
        <>
          <Headline2 styleAsHeading={3}>Expertise and Resources</Headline2>
          {!expertiseAndResourceDescription && isOwnProfile ? (
            <UserProfilePlaceholderCard title="How would you summarize your expertise and resources?">
              Add one or two sentences to help others understand your strengths
            </UserProfilePlaceholderCard>
          ) : (
            <Paragraph>{expertiseAndResourceDescription}</Paragraph>
          )}
          <div css={{ marginTop: `${24 / perRem}em` }}>
            <Divider />
          </div>
        </>
      )}
      <Headline2 styleAsHeading={3}>Tags</Headline2>
      {expertiseAndResourceTags.length ? (
        <>
          <div
            css={{
              marginTop: `${12 / perRem}em`,
              marginBottom: `${24 / perRem}em`,
            }}
          >
            <Paragraph noMargin accent="lead">
              Explore keywords related to skills, techniques, resources, and
              tools.
            </Paragraph>
          </div>

          <TagList tags={expertiseAndResourceTags} />
        </>
      ) : (
        <div css={{ marginTop: `${4 / perRem}em` }}>
          <UserProfilePlaceholderCard title="Add tags to your profile">
            Help other researchers find you by adding keywords about your
            skills, techniques, resources, and tools. Completing this section
            will make you more likely to come up in search results.
            <TagList
              tags={[
                'Structural biology',
                'Autophagy',
                'Transcriptional regulation',
                'Electron Microscopy',
                'Multi-omics',
                'Long-read sequencing',
                'LRRK2',
                'Alpha-synuclein',
                'VPS35',
              ]}
              enabled={false}
            />
          </UserProfilePlaceholderCard>
        </div>
      )}
    </Card>
  ) : null;
};

export default ProfileExpertiseAndResources;
