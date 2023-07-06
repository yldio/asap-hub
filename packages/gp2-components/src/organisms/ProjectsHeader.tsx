import { projectsImage } from '../images';
import PageBanner from './PageBanner';
import { Link, externalLinkIcon } from '@asap-hub/react-components';

const props = {
  image: projectsImage,
  position: 'center',
  title: 'Projects',
  description:
    'Explore GP2 projects being carried out by the network. If you are interested in starting a new project, please request a new project below.',
};

const ProjectsHeader: React.FC = () => (
  <PageBanner {...props}>
    <Link
      href="https://docs.google.com/forms/d/e/1FAIpQLScYnKgzk-gxFW6a8CgEkwowjCnWGdWqLxwF9YWacYHMnSaPzg/viewform"
      label="Request New Project"
      noMargin
      primary
      buttonStyle
    >
      Request New Project
      <span>{externalLinkIcon}</span>
    </Link>
  </PageBanner>
);

export default ProjectsHeader;
