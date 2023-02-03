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
  researchGateIcon,
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
  { icon: ReactNode; displayName: string; baseUrl?: string }
> = {
  googleScholar: {
    icon: <GoogleScholarIcon color={iconsColor} />,
    displayName: 'Google Scholar',
    baseUrl: 'https://scholar.google.com/citations?user=',
  },
  orcid: {
    icon: <OrcidIcon color={iconsColor} />,
    displayName: 'Orcid',
    baseUrl: 'https://orcid.org/',
  },
  researchGate: {
    icon: researchGateIcon,
    displayName: 'Research Gate',
    baseUrl: 'https://researchid.com/rid/',
  },
  researcherId: {
    icon: researchGateIcon,
    displayName: 'Researcher ID',
    baseUrl: 'https://researchid.com/rid/',
  },
  blog: {
    icon: <GlobeIcon color={iconsColor} />,
    displayName: 'Blog',
  },
  twitter: {
    icon: <TwitterIcon color={iconsColor} />,
    displayName: 'Twitter',
    baseUrl: 'https://twitter.com/',
  },
  linkedIn: {
    icon: <LinkedInIcon color={iconsColor} />,
    displayName: 'LinkedIn',
    baseUrl: 'https://linkedin.com/in/',
  },
  github: {
    icon: <GithubIcon color={iconsColor} />,
    displayName: 'Github',
    baseUrl: 'https://github.com/',
  },
};

const researchNetworksKeys: Array<keyof UserSocial> = [
  'googleScholar',
  'orcid',
  'researchGate',
  'researcherId'
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
    link: networkInfo[key].baseUrl ? `${networkInfo[key].baseUrl}${social?.[key]}`: social?.[key],
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
