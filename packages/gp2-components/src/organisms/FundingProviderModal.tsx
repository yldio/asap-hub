import { gp2 as gp2Model } from '@asap-hub/model';
import { LabeledTextArea } from '@asap-hub/react-components';
import { ComponentProps, useState } from 'react';
import EditUserModal from './EditUserModal';

type FundingProviderModalProps = Pick<gp2Model.UserResponse, 'fundingStreams'> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2Model.UserPatchRequest) => Promise<void>;
  };

const FundingProviderModal: React.FC<FundingProviderModalProps> = ({
  fundingStreams,
  backHref,
  onSave,
}) => {
  const [newFundingProvider, setNewFundingProvider] = useState(
    fundingStreams || '',
  );

  const checkDirty = () => newFundingProvider !== (fundingStreams || '');

  return (
    <EditUserModal
      title={'Funding Providers'}
      description={
        'This information will be pulled for when GP2 publications arise to share financial conflicts of interests for publications. Please make sure this is up to date!'
      }
      onSave={() =>
        onSave({
          fundingStreams: newFundingProvider,
        })
      }
      backHref={backHref}
      dirty={checkDirty()}
    >
      {({ isSaving }) => (
        <LabeledTextArea
          title={'Funding Names'}
          subtitle={'(optional)'}
          maxLength={1000}
          value={newFundingProvider}
          onChange={setNewFundingProvider}
          enabled={!isSaving}
          placeholder={
            'Example: University of Plymouth, University Hospitals Plymouth NHS Trust and National Institute of Health Research...'
          }
        />
      )}
    </EditUserModal>
  );
};

export default FundingProviderModal;
