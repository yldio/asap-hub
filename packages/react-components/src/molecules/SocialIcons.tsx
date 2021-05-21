import { useContext } from 'react';
import { UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { UserProfileContext } from '@asap-hub/react-context';

import { Link } from '../atoms';
import {
  linkedInIcon,
  githubIcon,
  twitterIcon,
  researchGateIcon,
  researcherIdIcon,
  orcidSocialIcon,
  googleScholarIcon,
} from '../icons';
import { perRem } from '../pixels';
import { tin } from '../colors';

const socialContainerStyles = css({
  display: 'grid',
  columnGap: `${12 / perRem}em`,
  gridAutoFlow: 'column',
});

const iconStyles = css({
  paddingTop: `${15 / perRem}em`,
  paddingBottom: `${17 / perRem}em`,
});

const SocialIconLink: React.FC<{
  link?: string;
  icon: JSX.Element;
  isOwnProfile: boolean;
}> = ({ link, icon, isOwnProfile }) =>
  link || isOwnProfile ? (
    <Link href={link}>
      <div css={[iconStyles, !link && { svg: { fill: tin.rgb } }]}>{icon}</div>
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
        icon={twitterIcon}
        isOwnProfile={isOwnProfile}
      />
      <SocialIconLink
        link={
          github
            ? new URL(`https://github.com/${github}`).toString()
            : undefined
        }
        icon={githubIcon}
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
        icon={googleScholarIcon}
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
        icon={linkedInIcon}
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
};

export default SocialIcons;
