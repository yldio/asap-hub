import { css } from '@emotion/react';
import { useState } from 'react';
import {
  Aim,
  GrantType,
  MilestoneCreateRequest,
  MilestoneStatus,
} from '@asap-hub/model';

import { Button, Headline3, MultiSelectOptionsType, Paragraph } from '../atoms';
import {
  LabeledDropdown,
  LabeledMultiSelect,
  LabeledTextArea,
  Modal,
} from '../molecules';
import { paddingStyles } from '../card';
import { rem, mobileScreen } from '../pixels';
import { crossIcon } from '../icons';
import { info100, info500, lead, neutral200, steel } from '../colors';
import ConfirmModal from './ConfirmModal';

const headerStyles = css(paddingStyles, {
  paddingBottom: 0,
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
});

const formBodyStyles = css(paddingStyles, {
  paddingTop: rem(16),
  display: 'grid',
  rowGap: rem(24),
});

const grantTypeStyles = css({
  display: 'grid',
  rowGap: rem(4),
});

const grantTypeLabelStyles = css({
  fontWeight: 700,
  fontSize: rem(17),
  margin: 0,
});

const grantTypeValueStyles = css({
  fontSize: rem(17),
  color: lead.rgb,
  margin: 0,
});

const aimsSectionStyles = css({
  display: 'grid',
  rowGap: rem(8),
});

const aimsLabelStyles = css({
  fontWeight: 700,
  fontSize: rem(17),
  margin: 0,
});

const aimsDescriptionStyles = css({
  fontSize: rem(15),
  color: lead.rgb,
  margin: 0,
});

const aimsChipContainerStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(8),
  padding: rem(12),
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(6),
  minHeight: rem(48),
});

const aimChipStyles = (selected: boolean) =>
  css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${rem(4)} ${rem(12)}`,
    borderRadius: rem(16),
    border: `1px solid ${selected ? info500.rgb : steel.rgb}`,
    backgroundColor: selected ? info100.rgb : 'white',
    color: selected ? info500.rgb : neutral200.rgb,
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: rem(14),
    userSelect: 'none',
    '&:hover': {
      borderColor: info500.rgb,
    },
  });

const buttonMediaQuery = `@media (min-width: ${mobileScreen.max - 100}px)`;

const buttonContainerStyles = css({
  display: 'grid',
  columnGap: rem(30),
  gridTemplateRows: 'max-content 12px max-content',
  [buttonMediaQuery]: {
    gridTemplateColumns: 'max-content max-content',
    gridTemplateRows: 'auto',
    justifyContent: 'flex-end',
  },
});

const cancelButtonStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '2 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
  },
});

const submitButtonStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '1 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
    gridColumn: '2',
  },
});

const milestoneStatuses: MilestoneStatus[] = [
  'Pending',
  'In Progress',
  'Complete',
  'Terminated',
];

type ArticleOption = MultiSelectOptionsType;

type MilestoneFormProps = {
  readonly grantType: GrantType;
  readonly aims: ReadonlyArray<Aim>;
  readonly onSubmit: (data: MilestoneCreateRequest) => Promise<void>;
  readonly onCancel: () => void;
  readonly getArticleSuggestions?: (
    inputValue: string,
    callback: (options: ReadonlyArray<ArticleOption>) => void,
  ) => Promise<ReadonlyArray<ArticleOption>> | void;
};

const MilestoneForm: React.FC<MilestoneFormProps> = ({
  grantType,
  aims,
  onSubmit,
  onCancel,
  getArticleSuggestions,
}) => {
  const [description, setDescription] = useState('');
  const [selectedAimIds, setSelectedAimIds] = useState<string[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<
    readonly ArticleOption[]
  >([]);
  const [status, setStatus] = useState<MilestoneStatus>('Pending');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const grantLabel = grantType === 'supplement' ? 'Supplement' : 'Original';

  const toggleAim = (aimId: string) => {
    setSelectedAimIds((prev) =>
      prev.includes(aimId)
        ? prev.filter((id) => id !== aimId)
        : [...prev, aimId],
    );
  };

  const handleSubmitClick = () => {
    setSubmitError(null);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    try {
      await onSubmit({
        grantType,
        description: description.trim(),
        status,
        aimIds: selectedAimIds,
        relatedArticleIds: selectedArticles.length
          ? selectedArticles.map((a) => a.value)
          : undefined,
      });
    } catch {
      setShowConfirmModal(false);
      setSubmitError('Failed to create milestone. Please try again.');
    }
  };

  if (showConfirmModal) {
    return (
      <ConfirmModal
        title="Confirm Milestone Creation"
        description="After creation, milestones cannot be deleted. If a milestone is no longer applicable, it should be marked as Terminated. Once added, the milestone will appear in the appropriate location within the project's milestone table based on its related aims and will be visible to all CRN members. All project members will be notified when a milestone is created, and designated members will then be able to update its status. If you need further assistance, please contact your Project Manager or Technical Support."
        confirmText="Confirm and Notify"
        cancelText="Keep Editing"
        confirmButtonStyle="primary"
        onSave={handleConfirm}
        onCancel={() => setShowConfirmModal(false)}
      />
    );
  }

  return (
    <Modal padding={false}>
      <header css={headerStyles}>
        <Button small onClick={onCancel}>
          {crossIcon}
        </Button>
        <Headline3>Add New Milestone</Headline3>
      </header>
      <div css={formBodyStyles}>
        <div css={grantTypeStyles}>
          <p css={grantTypeLabelStyles}>Grant Type</p>
          <p css={grantTypeValueStyles}>{grantLabel}</p>
        </div>

        <LabeledTextArea
          title="Milestone Description"
          subtitle="(required)"
          value={description}
          onChange={setDescription}
          maxLength={750}
          enabled
        />

        <div css={aimsSectionStyles}>
          <p css={aimsLabelStyles}>
            Related Aims <span css={{ fontWeight: 400 }}>(required)</span>
          </p>
          <p css={aimsDescriptionStyles}>
            Select the aim or aims that this milestone supports. Only aims
            defined for this project will be available below.
          </p>
          <div css={aimsChipContainerStyles}>
            {aims.length === 0 ? (
              <Paragraph accent="lead" noMargin>
                No aims have been defined for this grant type yet.
              </Paragraph>
            ) : (
              aims.map((aim) => (
                <button
                  key={aim.id}
                  type="button"
                  css={aimChipStyles(selectedAimIds.includes(aim.id))}
                  onClick={() => toggleAim(aim.id)}
                >
                  #{aim.order}
                </button>
              ))
            )}
          </div>
        </div>

        {getArticleSuggestions && (
          <LabeledMultiSelect<ArticleOption>
            title="Related Articles"
            subtitle="(optional)"
            description="Add the articles that resulted from completing this milestone or contributed to its progress. Only published articles on the CRN Hub will be available below. These articles will also be displayed in the corresponding Aim."
            placeholder="Start typing..."
            loadOptions={getArticleSuggestions}
            onChange={setSelectedArticles}
            values={selectedArticles}
            noOptionsMessage={({ inputValue }) =>
              `Sorry, no articles match "${inputValue}"`
            }
          />
        )}

        <LabeledDropdown<MilestoneStatus>
          title="Milestone status"
          subtitle="(required)"
          description="Select the status for this milestone from the options below. If the status is set to Complete or Terminated, it cannot be changed. Related articles may still be added later. If further updates are required, please contact Technical Support."
          value={status}
          options={milestoneStatuses.map((s) => ({
            label: s,
            value: s,
          }))}
          onChange={setStatus}
          required
        />

        {submitError && (
          <Paragraph accent="ember" noMargin>
            {submitError}
          </Paragraph>
        )}
        <div css={buttonContainerStyles}>
          <div css={cancelButtonStyles}>
            <Button onClick={onCancel}>Cancel</Button>
          </div>
          <div css={submitButtonStyles}>
            <Button
              primary
              onClick={handleSubmitClick}
              enabled={
                description.trim().length > 0 && selectedAimIds.length > 0
              }
            >
              Add Milestone
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MilestoneForm;
