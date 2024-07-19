import { gp2 as gp2Model } from '@asap-hub/model';
import { ComponentProps } from 'react';
import { useParams } from 'react-router-dom';
import ResourceModal from './ResourceModal';

type EditResponseModalProps = {
  resources: gp2Model.Resource[];
  updateResources: (payload: gp2Model.Resource[]) => Promise<void>;
} & Pick<ComponentProps<typeof ResourceModal>, 'backHref'>;

const EditResourceModal: React.FC<EditResponseModalProps> = ({
  resources,
  backHref,
  updateResources,
}) => {
  const { resourceIndex } = useParams<{ resourceIndex: string }>();
  const index = resourceIndex ? parseInt(resourceIndex, 10) : 0;
  const resource = resources[index];

  return (
    <ResourceModal
      {...resource}
      modalTitle={'Edit Resource'}
      modalDescription={
        'Edit or delete an existing resource that is being shared privately with your group.'
      }
      backHref={backHref}
      onSave={(updated: gp2Model.Resource) => {
        const updatedResources = resources.map((item, idx) =>
          idx === index ? updated : item,
        );
        return updateResources(updatedResources);
      }}
      onDelete={() => {
        const updatedResources = resources.filter((_, idx) => idx !== index);
        return updateResources(updatedResources);
      }}
    />
  );
};
export default EditResourceModal;
