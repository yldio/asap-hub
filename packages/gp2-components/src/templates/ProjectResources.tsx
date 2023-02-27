import { ComponentProps } from 'react';
import Resources from '../organisms/Resources';

type ProjectResourcesProps = Omit<ComponentProps<typeof Resources>, 'headline'>;

const headline = `This is a private space for this project on the
network. Nobody outside of this project can see anything that you
upload here.`;

const ProjectResources: React.FC<ProjectResourcesProps> = ({ ...props }) => (
  <Resources {...props} headline={headline} />
);

export default ProjectResources;
