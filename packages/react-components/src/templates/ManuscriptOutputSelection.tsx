import { css } from '@emotion/react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  contentSidePaddingWithNavigation,
  FormCard,
  LabeledMultiSelect,
  LabeledRadioButtonGroup,
} from '..';
import { mobileScreen, rem } from '../pixels';

const mainStyles = css({
  display: 'flex',
  justifyContent: 'center',
  padding: `${rem(36)} ${contentSidePaddingWithNavigation(8)} ${rem(60)}`,
});

const contentStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  maxWidth: rem(800),
  width: '100%',
  justifyContent: 'center',
  gridAutoFlow: 'row',
  rowGap: rem(32),
});

const optionListStyles = css({
  marginTop: rem(16),
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    gridTemplateColumns: '1fr',
  },
});

const formCardStyles = css({
  paddingTop: rem(18),
  paddingBottom: rem(12),
});

const manuscriptImportStyles = css({
  marginTop: rem(32),
});

const emptySpaceStyles = css({
  height: rem(12),
});

const buttonContainerStyles = css({
  display: 'grid',
  columnGap: rem(24),
  gridTemplateRows: 'max-content 12px max-content',
  [`@media (min-width: ${mobileScreen.max - 100}px)`]: {
    gridTemplateColumns: 'max-content max-content',
    gridTemplateRows: 'auto',
    justifyContent: 'flex-end',
  },
});

const confirmButtonStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '1 / span 2',
  gridColumn: '1',
  [`@media (min-width: ${mobileScreen.max - 100}px)`]: {
    gridRow: '1',
    gridColumn: '2',
  },
});

const dismissButtonStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '2 / span 2',
  gridColumn: '1',
  [`@media (min-width: ${mobileScreen.max - 100}px)`]: {
    gridRow: '1',
  },
});

type ManuscriptOutputSelectionProps = {
  manuscriptOutputSelection: 'manually' | 'import' | '';
  onChangeManuscriptOutputSelection: (
    manuscriptOutputSelection: 'manually' | 'import' | '',
  ) => void;
  onSelectCreateManually: () => void;
};

const ManuscriptOutputSelection: React.FC<ManuscriptOutputSelectionProps> = ({
  onChangeManuscriptOutputSelection,
  manuscriptOutputSelection,
  onSelectCreateManually,
}) => {
  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  };

  const renderManuscriptImport = () => {
    if (manuscriptOutputSelection !== 'import') {
      return <div css={emptySpaceStyles} />;
    }

    return (
      <div css={manuscriptImportStyles}>
        <LabeledMultiSelect
          noMargin
          title="Manuscript"
          description="Only the latest version of the manuscript is available for import. If the first preprint version hasn't been imported yet, it will be added automatically."
          subtitle="(required)"
          required
          placeholder="Start typing..."
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          loadOptions={() => {}}
          values={[]}
        />
      </div>
    );
  };

  const renderActionButtons = () => {
    if (manuscriptOutputSelection === '') {
      return null;
    }

    return (
      <div css={buttonContainerStyles}>
        <div css={dismissButtonStyles}>
          <Button noMargin onClick={handleCancel}>
            Cancel
          </Button>
        </div>
        <div css={confirmButtonStyles}>
          <Button
            noMargin
            enabled={manuscriptOutputSelection !== 'import'}
            onClick={
              manuscriptOutputSelection === 'manually'
                ? onSelectCreateManually
                : // eslint-disable-next-line @typescript-eslint/no-empty-function
                  () => {}
            }
            primary
          >
            {manuscriptOutputSelection === 'manually' ? 'Create' : 'Import'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <main css={mainStyles}>
      <div css={contentStyles}>
        <FormCard
          title="How would you like to create your output?"
          overrideStyles={formCardStyles}
        >
          <LabeledRadioButtonGroup<'manually' | 'import' | ''>
            title="Select the type of output you want to create:"
            subtitle="(required)"
            options={[
              { value: 'manually', label: 'Create manually' },
              { value: 'import', label: 'Import from manuscript' },
            ]}
            value={manuscriptOutputSelection ?? ''}
            onChange={onChangeManuscriptOutputSelection}
            overrideOptionListStyles={optionListStyles}
          />
          {renderManuscriptImport()}
        </FormCard>
        {renderActionButtons()}
      </div>
    </main>
  );
};

export default ManuscriptOutputSelection;
