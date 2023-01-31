import { gp2 as gp2Model } from '@asap-hub/model';
import { LabeledTextArea } from '@asap-hub/react-components';
import { ComponentProps, useState } from 'react';
import EditUserModal from './EditUserModal';

type FundingProvidersModalProps = Pick<
  gp2Model.UserResponse,
  'fundingStreams'
> &
  Pick<ComponentProps<typeof EditUserModal>, 'backHref'> & {
    onSave: (userData: gp2Model.UserPatchRequest) => Promise<void>;
  };

const FundingProvidersModal: React.FC<FundingProvidersModalProps> = ({
  fundingStreams,
  backHref,
  onSave,
}) => {
  const [newFundingProviders, setNewFundingProviders] = useState(
    fundingStreams || '',
  );

  const checkDirty = () => newFundingProviders !== (fundingStreams || '');

  return (
    <EditUserModal
      title={'Funding Providers'}
      description={
        'This information will be pulled for when GP2 publications arise to share financial conflicts of interests for publications. Please make sure this is up to date!'
      }
      onSave={() =>
        onSave({
          fundingStreams: newFundingProviders,
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
          value={newFundingProviders}
          onChange={setNewFundingProviders}
          enabled={!isSaving}
        />
      )}
    </EditUserModal>
  );
};

export default FundingProvidersModal;
