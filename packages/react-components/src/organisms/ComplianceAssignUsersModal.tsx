import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthorSelect, OptionsType } from '..';
import { Button, Headline3, Paragraph, Subtitle } from '../atoms';
import { paddingStyles } from '../card';
import { crossIcon } from '../icons';
import { Modal } from '../molecules';
import { mobileScreen, perRem, rem } from '../pixels';
import { AuthorOption } from './AuthorSelect';
import ComplianceTableRow from './ComplianceTableRow';

const headerStyles = css(paddingStyles, {
  paddingBottom: 0,
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
});

const controlsContainerStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
});

const buttonMediaQuery = `@media (min-width: ${mobileScreen.max - 100}px)`;

const buttonContainerStyles = css({
  display: 'grid',
  columnGap: `${30 / perRem}em`,
  gridTemplateRows: 'max-content 12px max-content',
  [buttonMediaQuery]: {
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
  [buttonMediaQuery]: {
    gridRow: '1',
    gridColumn: '2',
  },
});
const dismissButtonStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '2 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
  },
});

const InformationRow: React.FC<{
  title: string;
  value?: string;
  children?: React.ReactNode;
}> = ({ title, value, children }) => (
  <div css={{ display: 'flex', flexDirection: 'column', gap: rem(8) }}>
    <Subtitle noMargin>{title}</Subtitle>
    {value && (
      <Paragraph noMargin accent="lead">
        {value}
      </Paragraph>
    )}
    {children}
  </div>
);

export type AssignedUsersFormData = {
  assignedUsers: OptionsType<AuthorOption>;
};

type ComplianceAssignUsersModalProps = Pick<
  ComponentProps<typeof ComplianceTableRow>,
  'getAuthorSuggestions'
> & {
  onDismiss: () => void;
  onConfirm: (data: AssignedUsersFormData) => Promise<void>;
  PillId: React.FC;
  teams: string;
  apcCoverage: string;
  manuscriptTitle: string;
  assignedUsers: OptionsType<AuthorOption>;
};

const ComplianceAssignUsersModal: React.FC<ComplianceAssignUsersModalProps> = ({
  onDismiss,
  onConfirm,
  PillId,
  teams,
  apcCoverage,
  manuscriptTitle,
  getAuthorSuggestions,
  assignedUsers,
}) => {
  const methods = useForm<AssignedUsersFormData>({
    mode: 'onBlur',
    defaultValues: {
      assignedUsers,
    },
  });
  const { setValue, watch, handleSubmit } = methods;
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const handleConfirm = async (data: AssignedUsersFormData) => {
    setIsRequestInProgress(true);
    await onConfirm(data);
    setIsRequestInProgress(false);
  };

  return (
    <form>
      <Modal padding={false} overrideModalStyles={css({ minWidth: '50%' })}>
        <header css={headerStyles}>
          <div css={controlsContainerStyles}>
            <Button small onClick={onDismiss} enabled={!isRequestInProgress}>
              {crossIcon}
            </Button>
          </div>
          <Headline3>Assign User</Headline3>
        </header>
        <div css={[paddingStyles, css({ paddingTop: 0 })]}>
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              gap: rem(48),
              marginTop: rem(32),
            }}
          >
            <InformationRow title="Manuscript Title" value={manuscriptTitle} />
            <InformationRow title="ID">
              <PillId />
            </InformationRow>
            <InformationRow title="Team(s)" value={teams} />
            <InformationRow title="APC Coverage" value={apcCoverage} />

            <AuthorSelect
              isMulti
              title="Assign User"
              subtitle="(required)"
              placeholder="Start typing..."
              loadOptions={getAuthorSuggestions}
              onChange={(
                newAuthors: OptionsType<AuthorOption> | AuthorOption | null,
              ) => {
                if (newAuthors && Array.isArray(newAuthors)) {
                  setValue('assignedUsers', newAuthors);
                }
              }}
              values={watch('assignedUsers')}
            />
          </div>

          <div css={buttonContainerStyles}>
            <div css={dismissButtonStyles}>
              <Button enabled={!isRequestInProgress} onClick={onDismiss}>
                Cancel
              </Button>
            </div>
            <div css={confirmButtonStyles}>
              <Button
                primary
                enabled={!isRequestInProgress}
                onClick={handleSubmit(handleConfirm)}
              >
                Assign
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </form>
  );
};

export default ComplianceAssignUsersModal;
