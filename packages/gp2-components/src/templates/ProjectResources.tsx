import { gp2 } from '@asap-hub/model';
import Resources from '../organisms/Resources';

type ProjectResourcesProps = Pick<gp2.ProjectResponse, 'resources'>;

const headline = `Please note, this is a private space for this project on the
        network. Nobody outside of this project can see anything that you
        upload here.`;
const ProjectResources: React.FC<ProjectResourcesProps> = ({ resources }) => (
  <Resources resources={resources} headline={headline} />
);
export default ProjectResources;
