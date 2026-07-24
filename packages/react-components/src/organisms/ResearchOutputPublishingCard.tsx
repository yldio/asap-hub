import {
  DecisionOption,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchOutputSharingStatus,
} from '@asap-hub/model';
import {
  FormCard,
  LabeledDateField,
  LabeledRadioButtonGroup,
} from '../molecules';
import { noop } from '../utils';

type ResearchOutputPublishingCardProps = Pick<
  ResearchOutputPostRequest,
  'sharingStatus'
> & {
  researchOutputData?: ResearchOutputResponse;
  documentType?: ResearchOutputResponse['documentType'];
  onChangeAsapFunded?: (newValue: DecisionOption) => void;
  onChangeUsedInPublication?: (newValue: DecisionOption) => void;
  onChangeSharingStatus?: (newValue: ResearchOutputSharingStatus) => void;
  onChangePublishDate?: (newValue: Date | undefined) => void;
  asapFunded: DecisionOption;
  usedInPublication: DecisionOption;
  publishDate?: Date;
  isCreatingOutputRoute?: boolean;
  isImportedFromManuscript?: boolean;
  disableDateMadePublic?: boolean;
};

export const getPublishDateValidationMessage = (e: ValidityState): string => {
  if (e.valueMissing) {
    return 'Please enter the date made public.';
  }
  if (e.badInput) {
    return 'Date published should be complete or removed';
  }
  return 'Publish date cannot be greater than today';
};

const ResearchOutputPublishingCard: React.FC<
  ResearchOutputPublishingCardProps
> = ({
  researchOutputData,
  documentType,
  isCreatingOutputRoute,
  asapFunded,
  usedInPublication,
  sharingStatus,
  publishDate,
  isImportedFromManuscript,
  disableDateMadePublic,
  onChangeAsapFunded = noop,
  onChangeUsedInPublication = noop,
  onChangeSharingStatus = noop,
  onChangePublishDate = noop,
}) => (
  <FormCard title="Funding and Publication Details">
    <LabeledRadioButtonGroup
      title="Has this output been funded by ASAP?"
      subtitle="(required)"
      options={[
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
        { value: 'Not Sure', label: 'Not Sure' },
      ]}
      value={asapFunded}
      onChange={onChangeAsapFunded}
    />

    <LabeledRadioButtonGroup
      title="Has this output been used in a publication?"
      subtitle="(required)"
      options={[
        { value: 'Yes', label: 'Yes' },
        {
          value: 'No',
          label: 'No',
          disabled:
            isCreatingOutputRoute &&
            documentType === 'Article' &&
            researchOutputData?.usedInPublication === undefined,
        },
        {
          value: 'Not Sure',
          label: 'Not Sure',
          disabled:
            isCreatingOutputRoute &&
            documentType === 'Article' &&
            researchOutputData?.usedInPublication === undefined,
        },
      ]}
      value={usedInPublication}
      onChange={onChangeUsedInPublication}
    />

    <LabeledRadioButtonGroup
      title="Sharing status"
      subtitle="(required)"
      options={[
        {
          value: 'Network Only',
          label: 'CRN Only',
          disabled:
            (documentType === 'Article' &&
              researchOutputData?.sharingStatus === undefined) ||
            isImportedFromManuscript,
        },
        { value: 'Public', label: 'Public' },
      ]}
      value={sharingStatus}
      onChange={onChangeSharingStatus}
    />

    {sharingStatus === 'Public' ? (
      <LabeledDateField
        title={'Date made public'}
        subtitle={'(required)'}
        description={'The date this output first became publicly available.'}
        required
        enabled={!disableDateMadePublic}
        onChange={onChangePublishDate}
        value={publishDate}
        max={new Date()}
        getValidationMessage={(e) => getPublishDateValidationMessage(e)}
      />
    ) : null}
  </FormCard>
);

export default ResearchOutputPublishingCard;
