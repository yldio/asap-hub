import { gp2 as gp2Model } from '@asap-hub/model';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { ComponentProps } from 'react';
import ResourceModal from './ResourceModal';

const { resource: resourceRoute } = gp2Routing;

type EditResponseModalProps = {
  resources: gp2Model.Resource[];
  route: typeof resourceRoute;
  updateResources: (payload: gp2Model.Resource[]) => Promise<void>;
} & Pick<ComponentProps<typeof ResourceModal>, 'backHref'>;

const EditResourceModal: React.FC<EditResponseModalProps> = ({
  resources,
  route,
  backHref,
  updateResources,
}) => {
  const { resourceIndex } = useRouteParams(route);
  const routeIndex = parseInt(resourceIndex, 10);
  const resourceOutput = resources[routeIndex];
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
        updateResources([
          ...Object.assign([], resources, {
            [routeIndex]: resource,
          }),
        ]);
      }}
      onDelete={() => {
        const newResources = [...resources];
        newResources.splice(routeIndex, 1);
        return updateResources([...newResources]);
      }}
    />
  );
};
export default EditResourceModal;
