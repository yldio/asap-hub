import { ResourceModal } from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import { NotFoundPage } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

type EditResponseModalProps = {
  resources: gp2Model.Resource[];
  resourceIndex: string;
  updateResources: (payload: gp2Model.Resource[]) => Promise<void>;
} & Pick<ComponentProps<typeof ResourceModal>, 'backHref'>;

const EditResourceModal: React.FC<EditResponseModalProps> = ({
  resources,
  resourceIndex,
  backHref,
  updateResources,
}) => {
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
    />
  );
};
export default EditResourceModal;
