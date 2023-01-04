import { UserResponse, UserSocial } from '@asap-hub/model/src/gp2';
import {
  GithubIcon,
  GlobeIcon,
  GoogleScholarIcon,
  LinkedInIcon,
  OrcidIcon,
  Divider,
  TwitterIcon,
  Link,
  Subtitle,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ReactNode } from 'react';
import colors from '../templates/colors';

const { rem } = pixels;
const iconsColor = colors.neutral900.hex;

const externalProfilesContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(20),
});

const buttonsContainerStyles = css({
  marginTop: rem(16),
  display: 'inline-flex',
  flexDirection: 'row',
  gap: rem(16),
  flexWrap: 'wrap',
});

const getNetworkInfo = (key: string) => {
  switch (key) {
    case 'googleScholar':
      return {
        icon: <GoogleScholarIcon color={iconsColor} />,
        displayName: 'Google Scholar',
      };
    case 'orcid':
      return {
        icon: <OrcidIcon color={iconsColor} />,
        displayName: key,
      };
    case 'blog':
      return {
        icon: <GlobeIcon color={iconsColor} />,
        displayName: key,
      };
    case 'twitter':
      return {
        icon: <TwitterIcon color={iconsColor} />,
        displayName: key,
      };
    case 'linkedIn':
      return {
        icon: <LinkedInIcon color={iconsColor} />,
        displayName: key,
      };
    case 'github':
      return {
        icon: <GithubIcon color={iconsColor} />,
        displayName: key,
      };
    default:
      return null;
  }
};

interface SocialLinkProps {
  readonly key?: string;
  readonly link?: string;
  readonly icon?: ReactNode;
  readonly displayName?: string;
}

const SocialLink = ({ link, icon, displayName }: SocialLinkProps) => {
  return (
    <div css={{ textTransform: 'capitalize' }}>
      <Link href={link} buttonStyle noMargin small>
        {icon}
        {displayName}
      </Link>
    </div>
  );
};

interface SocialSubGroupProps {
  readonly list: SocialLinkProps[];
  readonly title: string;
}

const SocialSubGroup = ({ list, title }: SocialSubGroupProps) =>
  list.length ? (
    <div>
      <Subtitle styleAsHeading={4} bold hasMargin={false} accent="lead">
        {title}
      </Subtitle>
      <div css={buttonsContainerStyles}>
        {list.map((link) => (
          <SocialLink {...link} />
        ))}
      </div>
    </div>
  ) : null;

const UserExternalProfiles = ({ social }: Pick<UserResponse, 'social'>) => {
  const filterSocial = (key: string) => !!social?.[key as keyof UserSocial];
  const mapSocialInfo = (key: string) => ({
    key,
    link: social?.[key as keyof UserSocial],
    ...getNetworkInfo(key),
  });
  const researchNetworks = ['googleScholar', 'orcid']
    .filter(filterSocial)
    .map(mapSocialInfo);
  const socialNetworks = ['blog', 'twitter', 'linkedIn', 'github']
    .filter(filterSocial)
    .map(mapSocialInfo);

  const hasResearchNetworks = !!researchNetworks.length;
  const hasSocialNetworks = !!socialNetworks.length;

  return (
    <div css={externalProfilesContainerStyles}>
      {hasResearchNetworks && (
        <SocialSubGroup list={researchNetworks} title="Research Networks" />
      )}
      {hasResearchNetworks && hasSocialNetworks && <Divider />}
      {hasSocialNetworks && (
        <SocialSubGroup list={socialNetworks} title="Social Networks" />
      )}
    </div>
  );
};

export default UserExternalProfiles;
