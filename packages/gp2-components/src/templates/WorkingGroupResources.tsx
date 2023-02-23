import { ComponentProps } from 'react';
import Resources from '../organisms/Resources';

type WorkingGroupResourcesProps = Omit<
  ComponentProps<typeof Resources>,
  'headline'
>;

const headline = (
  <div>
    <b>Please note</b>
    <br />
    Please note, this is a private space for this working group on the network.
    Nobody outside of this working group can see anything that you upload here.
  </div>
);

const WorkingGroupResources: React.FC<WorkingGroupResourcesProps> = ({
  ...props
}) => <Resources {...props} headline={headline} />;
export default WorkingGroupResources;
