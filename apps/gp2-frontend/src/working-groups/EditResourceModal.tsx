import { gp2 as gp2Model } from '@asap-hub/model';
import { ResourceModal } from '@asap-hub/gp2-components';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { ComponentProps } from 'react';
import { NotFoundPage } from '@asap-hub/react-components';

const { workingGroups } = gp2Routing;

type EditResponseModalProps = {
  workingGroupId: string;
  workingGroup: gp2Model.WorkingGroupResponse;
  updateWorkingGroupResources: (payload: gp2Model.Resource[]) => Promise<void>;
} & Pick<ComponentProps<typeof ResourceModal>, 'backHref'>;

const EditResourceModal: React.FC<EditResponseModalProps> = ({
  workingGroupId,
  workingGroup,
  backHref,
  updateWorkingGroupResources,
}) => {
  const { resourceIndex } = useRouteParams(
    workingGroups({}).workingGroup({ workingGroupId }).resources({}).edit({})
      .resource,
  );
  const routeIndex = parseInt(resourceIndex, 10);
  const resourceOutput =
    workingGroup.resources && workingGroup.resources[routeIndex];
  if (!resourceOutput) {
    return <NotFoundPage />;
  }

  return (
    <ResourceModal
      {...resourceOutput}
      modalTitle={'Edit Resource'}
      modalDescription={
        'Edit or delete an existing resource that is being shared privately with your group.'
      }
      backHref={backHref}
      onSave={(resource: gp2Model.Resource) => {
        updateWorkingGroupResources([
          ...Object.assign([], workingGroup.resources, {
            [routeIndex]: resource,
          }),
        ]);
      }}
    />
  );
};
export default EditResourceModal;
