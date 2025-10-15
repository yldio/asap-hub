import { AuthorResponse } from '@asap-hub/model';
import { isInternalUser } from '@asap-hub/validation';
import { css } from '@emotion/react';
import { ReactElement, ReactNode } from 'react';
import { components } from 'react-select';
import { Avatar } from '../atoms';
import { MultiSelectOptionsType } from '../atoms/MultiSelect';
import { paper, steel } from '../colors';
import { borderWidth } from '../form';
import { crossIcon, plusIcon, userPlaceholderIcon } from '../icons';
import LabeledMultiSelect, {
  LabeledMultiSelectProps,
} from '../molecules/LabeledMultiSelect';
import { rem } from '../pixels';

const externalAuthorStyles = css({
  borderRadius: '50%',
  height: rem(24),
  overflow: 'hidden',
});

const LabelWithAvatar = ({
  author,
  externalLabel,
  children,
}: {
  author?: AuthorResponse;
  externalLabel: string;
  children: ReactElement | ReactNode;
}) =>
  author && isInternalUser(author) ? (
    <>
      <Avatar
        firstName={author.firstName}
        lastName={author.lastName}
        imageUrl={author.avatarUrl}
        overrideStyles={css({ margin: 0 })}
      />
      <span>{children}</span>
    </>
  ) : (
    <>
      <div css={externalAuthorStyles}>{userPlaceholderIcon}</div>
      <span>
        {children} ({externalLabel})
      </span>
    </>
  );

const optionStyles = css({
  display: 'grid',

  gridTemplateColumns: `${rem(24)} 1fr`,
  gridColumnGap: rem(8),
});

const singleValueStyles = css({
  padding: `${rem(5)} ${rem(15)} ${rem(5)} ${rem(8)}`,
  margin: `${rem(5)} ${rem(6)} ${rem(5)}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderColor: steel.rgb,
  borderRadius: rem(18),
  backgroundColor: paper.rgb,
});

const singleValuesRemoveStyles = css({
  display: 'inline-flex',
  height: rem(24),
  width: rem(12),
  cursor: 'pointer',

  svg: {
    strokeWidth: 2.5,
  },
});

export type AuthorOption = {
  author?: AuthorResponse;
} & MultiSelectOptionsType;

type AuthorSelectProps = LabeledMultiSelectProps<AuthorOption, boolean> & {
  externalLabel?: string;
  useDefaultErrorMessage?: boolean;
};

const AuthorSelect: React.FC<AuthorSelectProps> = ({
  externalLabel = 'Non CRN',
  isMulti,
  creatable = true,
  useDefaultErrorMessage = true,
  ...props
}) => (
  <LabeledMultiSelect<AuthorOption, boolean>
    {...props}
    {...(useDefaultErrorMessage
      ? { getValidationMessage: () => 'Please select at least one author.' }
      : {})}
    isMulti={isMulti}
    creatable={creatable}
    components={{
      SingleValue: (singleValueLabelProps) => (
        <components.SingleValue {...singleValueLabelProps}>
          <div css={[optionStyles, singleValueStyles]}>
            <LabelWithAvatar
              author={singleValueLabelProps.data.author}
              externalLabel={externalLabel}
            >
              {singleValueLabelProps.children}
            </LabelWithAvatar>
            <div
              role="button"
              onClick={singleValueLabelProps.clearValue}
              css={singleValuesRemoveStyles}
            >
              {crossIcon}
            </div>
          </div>
        </components.SingleValue>
      ),
      MultiValueContainer: (multiValueContainerProps) => (
        <div
          css={{
            ...multiValueContainerProps.selectProps.styles.multiValue(),
            paddingLeft: rem(8),
          }}
        >
          {multiValueContainerProps.children}
        </div>
      ),
      MultiValueLabel: (multiValueLabelProps) => (
        <components.MultiValueLabel {...multiValueLabelProps}>
          <div css={optionStyles}>
            <LabelWithAvatar
              author={multiValueLabelProps.data.author}
              externalLabel={externalLabel}
            >
              {multiValueLabelProps.children}
            </LabelWithAvatar>
          </div>
        </components.MultiValueLabel>
      ),
      MultiValueRemove: (multiValueRemoveProps) => (
        <components.MultiValueRemove {...multiValueRemoveProps}>
          <span aria-label={`Remove ${multiValueRemoveProps.data.label}`}>
            {crossIcon}
          </span>
        </components.MultiValueRemove>
      ),
      Option: (optionProps) => (
        <components.Option {...optionProps}>
          <div css={optionStyles}>
            {optionProps.data.author ? (
              <LabelWithAvatar
                author={optionProps.data.author}
                externalLabel={externalLabel}
              >
                {optionProps.children}
              </LabelWithAvatar>
            ) : (
              <>
                {plusIcon}
                <span>
                  <strong>{optionProps.children} </strong>({externalLabel})
                </span>
              </>
            )}
          </div>
        </components.Option>
      ),
    }}
  />
);
export type AuthorSelectType = typeof AuthorSelect;
export default AuthorSelect;
