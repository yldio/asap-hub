import { gp2 } from '@asap-hub/model';
import { usePushFromHere } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import EditUserModal from './EditUserModal';

type PublishModalProps = Pick<
  ComponentProps<typeof EditUserModal>,
  'backHref'
> & {
  onSave: (userData: gp2.UserPatchRequest) => Promise<void>;
};

const PublishModal: React.FC<PublishModalProps> = ({ onSave, backHref }) => {
  const historyPush = usePushFromHere();

  return (
    <EditUserModal
      title="Publish profile for the whole hub?"
      description="You can update your information at any time by accessing your profile. All GP2 Hub members will be able to access it."
      onSave={async () => {
        await onSave({
          onboarded: true,
        });
        historyPush('/');
      }}
      backHref={backHref}
      dirty={false}
      buttonText="Publish"
    />
  );
};
export default PublishModal;
