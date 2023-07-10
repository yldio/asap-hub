import { Link, externalLinkIcon, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { projectsImage } from '../images';
import PageBanner from './PageBanner';

const { perRem, mobileScreen } = pixels;
const props = {
  image: projectsImage,
  position: 'center',
  title: 'Projects',
  description:
    'Explore GP2 projects being carried out by the network. If you are interested in starting a new project, please request a new project below.',
};

const buttonStyle = css({
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    width: '72%',
  },
});

const externalIconStyle = css({
  display: 'flex',
  alignSelf: 'center',
  marginLeft: `${8 / perRem}em`,
});

const ProjectsHeader: React.FC = () => (
  <PageBanner {...props}>
    <div css={buttonStyle}>
      <Link
        href="https://docs.google.com/forms/d/e/1FAIpQLScYnKgzk-gxFW6a8CgEkwowjCnWGdWqLxwF9YWacYHMnSaPzg/viewform"
        label="Request New Project"
        primary
        buttonStyle
        small
      >
        Request New Project
        <span css={externalIconStyle}>{externalLinkIcon}</span>
      </Link>
    </div>
  </PageBanner>
);

export default ProjectsHeader;
