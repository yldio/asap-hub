import { gp2 } from '@asap-hub/model';
import Resources from '../organisms/Resources';

type WorkingGroupResourcesProps = Pick<gp2.WorkingGroupResponse, 'resources'>;

const headline = `Please note, this is a private space for this working group on the
        network. Nobody outside of this working group can see anything that you
        upload here.`;
const WorkingGroupResources: React.FC<WorkingGroupResourcesProps> = ({
  resources,
}) => <Resources resources={resources} headline={headline} />;
export default WorkingGroupResources;
