import { useContext } from 'react';
import { UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { UserProfileContext } from '@asap-hub/react-context';

import { Link } from '../atoms';
import {
  LinkedInIcon,
  GithubIcon,
  TwitterIcon,
  researchGateIcon,
  researcherIdIcon,
  orcidSocialIcon,
  GoogleScholarIcon,
  GlobeIcon,
} from '../icons';
import { perRem } from '../pixels';
import { tin } from '../colors';

const ROW_GAP = 12;
const socialContainerStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  paddingRight: `-${ROW_GAP / perRem}em`,
  paddingTop: `${15 / perRem}em`,
  paddingBottom: `${17 / perRem}em`,
});

const iconStyles = css({
  paddingRight: `${ROW_GAP / perRem}em`,
  svg: {
    width: '28px',
    height: '28px',
  },
});

const inactiveStyles = css({ svg: { fill: tin.rgb, stroke: tin.rgb } });

const SocialIconLink: React.FC<{
  link?: string;
  icon: JSX.Element;
  isOwnProfile: boolean;
}> = ({ link, icon, isOwnProfile }) =>
  link || isOwnProfile ? (
    <Link href={link}>
      <div css={[iconStyles, !link && inactiveStyles]}>{icon}</div>
    </Link>
  ) : null;

type SocialIconsProps = UserResponse['social'];

const SocialIcons: React.FC<SocialIconsProps> = ({
  github,
  linkedIn,
  orcid,
  researcherId,
  twitter,
  googleScholar,
  researchGate,
  website1,
  website2,
}) => {
  const { isOwnProfile } = useContext(UserProfileContext);
  return (
    <div css={socialContainerStyles}>
      <SocialIconLink
        link={
          orcid ? new URL(`https://orcid.org/${orcid}`).toString() : undefined
        }
        icon={orcidSocialIcon}
        isOwnProfile={isOwnProfile}
      />
      <SocialIconLink
        link={
          researcherId
            ? new URL(
                `https://publons.com/researcher/${researcherId}`,
              ).toString()
            : undefined
        }
        icon={researcherIdIcon}
        isOwnProfile={isOwnProfile}
      />
      <SocialIconLink
        link={
          twitter
            ? new URL(`https://twitter.com/${twitter}`).toString()
            : undefined
        }
        icon={<TwitterIcon />}
        isOwnProfile={isOwnProfile}
      />
      <SocialIconLink
        link={
          github
            ? new URL(`https://github.com/${github}`).toString()
            : undefined
        }
        icon={<GithubIcon />}
        isOwnProfile={isOwnProfile}
      />
      <SocialIconLink
        link={
          googleScholar
            ? `https://scholar.google.co.uk/citations?${new URLSearchParams({
                user: googleScholar,
              }).toString()}`
            : undefined
        }
        icon={<GoogleScholarIcon />}
        isOwnProfile={isOwnProfile}
      />
      <SocialIconLink
        link={
          researchGate
            ? new URL(
                `https://www.researchgate.net/profile/${researchGate}`,
              ).toString()
            : undefined
        }
        icon={researchGateIcon}
        isOwnProfile={isOwnProfile}
      />
      <SocialIconLink
        link={
          linkedIn
            ? new URL(`https://www.linkedin.com/in/${linkedIn}`).toString()
            : undefined
        }
        icon={<LinkedInIcon />}
        isOwnProfile={isOwnProfile}
      />
      <SocialIconLink
        link={website1}
        icon={<GlobeIcon />}
        isOwnProfile={isOwnProfile}
      />
      <SocialIconLink
        link={website2}
        icon={<GlobeIcon />}
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
};

export default SocialIcons;
