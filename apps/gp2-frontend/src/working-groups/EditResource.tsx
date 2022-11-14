import { gp2 as gp2Model } from '@asap-hub/model';
import { ResourceModal } from '@asap-hub/gp2-components';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';

const { workingGroups } = gp2Routing;

const modalInfo = {
  title: 'Edit Resource',
  description:
    'Edit or delete an existing resource that is being shared privately with your group.',
};

type EditWorkingGroupResponseProps = {
  workingGroupId: string;
  workingGroup: gp2Model.WorkingGroupResponse;
  backHref: string;
  updateWorkingGroupResources: (payload: gp2Model.Resource[]) => Promise<void>;
};

const EditResource: React.FC<EditWorkingGroupResponseProps> = ({
  workingGroupId,
  workingGroup,
  backHref,
  updateWorkingGroupResources,
}) => {
  let resourceOutput = {};
  const { resourceIndex } = useRouteParams(
    workingGroups({}).workingGroup({ workingGroupId }).resources({}).edit({})
      .resource,
  );
  const routeIndex = parseInt(resourceIndex, 10);

  resourceOutput = workingGroup.resources
    ? workingGroup.resources[routeIndex]
    : {};

  return (
    <ResourceModal
      {...resourceOutput}
      modalTitle={modalInfo.title}
      modalDescription={modalInfo.description}
      backHref={backHref}
      onSave={(resource: gp2Model.Resource) => {
        updateWorkingGroupResources([
          ...(Object.assign([], workingGroup.resources, {
            [routeIndex]: resource,
          }) || []),
        ]);
      }}
    />
  );
};
export default EditResource;
