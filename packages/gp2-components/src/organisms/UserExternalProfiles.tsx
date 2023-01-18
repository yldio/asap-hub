import { gp2 } from '@asap-hub/model';
import { UserSocial } from '@asap-hub/model/src/gp2';
import {
  GithubIcon,
  GlobeIcon,
  GoogleScholarIcon,
  LinkedInIcon,
  OrcidIcon,
  Divider,
  TwitterIcon,
  pixels,
  UserProfilePlaceholderCard,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import React, { ComponentProps, ReactNode } from 'react';
import EditableCard from '../molecules/EditableCard';
import colors from '../templates/colors';
import SocialSubGroup from './SocialSubGroup';

const { rem } = pixels;
const iconsColor = colors.neutral900.rgb;

const externalProfilesContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(20),
});

const networkInfo: Record<
  keyof UserSocial,
  { icon: ReactNode; displayName: string }
> = {
  googleScholar: {
    icon: <GoogleScholarIcon color={iconsColor} />,
    displayName: 'Google Scholar',
  },
  orcid: {
    icon: <OrcidIcon color={iconsColor} />,
    displayName: 'Orcid',
  },
  blog: {
    icon: <GlobeIcon color={iconsColor} />,
    displayName: 'Blog',
  },
  twitter: {
    icon: <TwitterIcon color={iconsColor} />,
    displayName: 'Twitter',
  },
  linkedIn: {
    icon: <LinkedInIcon color={iconsColor} />,
    displayName: 'LinkedIn',
  },
  github: {
    icon: <GithubIcon color={iconsColor} />,
    displayName: 'Github',
  },
};

const researchNetworksKeys: Array<keyof UserSocial> = [
  'googleScholar',
  'orcid',
];

const socialNetworkKeys: Array<keyof UserSocial> = [
  'blog',
  'twitter',
  'linkedIn',
  'github',
];

type UserExternalProfilesProps = Pick<gp2.UserResponse, 'social'> &
  Pick<ComponentProps<typeof EditableCard>, 'editHref'>;

const UserExternalProfiles: React.FC<UserExternalProfilesProps> = ({
  social,
  editHref,
}) => {
  const filterSocial = (key: keyof UserSocial) => !!social?.[key];
  const mapSocialInfo = (key: keyof UserSocial) => ({
    key,
    link: social?.[key],
    ...networkInfo[key],
  });
  const researchNetworks = researchNetworksKeys
    .filter(filterSocial)
    .map(mapSocialInfo);
  const socialNetworks = socialNetworkKeys
    .filter(filterSocial)
    .map(mapSocialInfo);

  const hasResearchNetworks = !!researchNetworks.length;
  const hasSocialNetworks = !!socialNetworks.length;

  return (
    <EditableCard
      editHref={editHref}
      title="External Profiles"
      edit={!!(hasResearchNetworks || hasSocialNetworks)}
      optional
    >
      {editHref && !hasResearchNetworks && !hasSocialNetworks ? (
        <UserProfilePlaceholderCard>
          Share external research network or social network profiles that are
          relevant to your work.
        </UserProfilePlaceholderCard>
      ) : (
        <div css={externalProfilesContainerStyles}>
          {hasResearchNetworks && (
            <SocialSubGroup list={researchNetworks} title="Research Networks" />
          )}
          {hasResearchNetworks && hasSocialNetworks && <Divider />}
          {hasSocialNetworks && (
            <SocialSubGroup list={socialNetworks} title="Social Networks" />
          )}
        </div>
      )}
    </EditableCard>
  );
};

export default UserExternalProfiles;
