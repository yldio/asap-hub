import { gp2 as gp2Model } from '@asap-hub/model';
import { ResourceModal } from '@asap-hub/gp2-components';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { ComponentProps } from 'react';
import { NotFoundPage } from '@asap-hub/react-components';

const { workingGroups } = gp2Routing;

type EditResponseModalProps = Pick<
  gp2Model.WorkingGroupResponse,
  'resources'
> & {
  workingGroupId: string;
  updateWorkingGroupResources: (
    payload: gp2Model.WorkingGroupResourcesPutRequest,
  ) => Promise<void>;
} & Pick<ComponentProps<typeof ResourceModal>, 'backHref'>;

const EditResourceModal: React.FC<EditResponseModalProps> = ({
  resources,
  workingGroupId,
  backHref,
  updateWorkingGroupResources,
}) => {
  const { resourceIndex } = useRouteParams(
    workingGroups({}).workingGroup({ workingGroupId }).resources({}).edit({})
      .resource,
  );
  const routeIndex = parseInt(resourceIndex, 10);
  const resourceOutput = resources && resources[routeIndex];
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
      onSave={(resource: gp2Model.Resource) =>
        updateWorkingGroupResources(
          Object.assign([], resources, {
            [routeIndex]: resource,
          }),
        )
      }
      onDelete={() => {
        const newResources = [...resources];
        newResources.splice(routeIndex, 1);
        return updateWorkingGroupResources([...newResources]);
      }}
    />
  );
};
export default EditResourceModal;
