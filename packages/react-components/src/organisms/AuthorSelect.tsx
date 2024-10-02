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
import { perRem } from '../pixels';

const externalAuthorStyles = css({
  borderRadius: '50%',
  height: `${24 / perRem}em`,
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

  gridTemplateColumns: `${24 / perRem}em 1fr`,
  gridColumnGap: `${8 / perRem}em`,
});

const singleValueStyles = css({
  padding: `${5 / perRem}em ${15 / perRem}em ${5 / perRem}em ${8 / perRem}em`,
  margin: `${5 / perRem}em ${6 / perRem}em ${5 / perRem}em`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderColor: steel.rgb,
  borderRadius: `${18 / perRem}em`,
  backgroundColor: paper.rgb,
});

const singleValuesRemoveStyles = css({
  display: 'inline-flex',
  height: `${24 / perRem}em`,
  width: `${12 / perRem}em`,
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
};

const AuthorSelect: React.FC<AuthorSelectProps> = ({
  externalLabel = 'Non CRN',
  isMulti,
  ...props
}) => (
  <LabeledMultiSelect<AuthorOption, boolean>
    {...props}
    isMulti={isMulti}
    creatable={true}
    getValidationMessage={() => 'Please select at least one author.'}
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
            paddingLeft: `${8 / perRem}em`,
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

export default AuthorSelect;
