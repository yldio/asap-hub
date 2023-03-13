import { AuthorResponse } from '@asap-hub/model';
import { isInternalUser } from '@asap-hub/validation';
import { css } from '@emotion/react';
import { ReactElement, ReactNode } from 'react';
import { components } from 'react-select';
import { Avatar } from '../atoms';
import { userPlaceholderIcon, plusIcon } from '../icons';
import { MultiSelectOptionsType } from '../atoms/MultiSelect';
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

type AuthorOption = {
  author?: AuthorResponse;
} & MultiSelectOptionsType;

type AuthorSelectProps = LabeledMultiSelectProps<AuthorOption> & {
  externalLabel?: string;
};

const AuthorSelect: React.FC<AuthorSelectProps> = ({
  externalLabel = 'Non CRN',
  ...props
}) => (
  <LabeledMultiSelect<AuthorOption>
    {...props}
    creatable={true}
    getValidationMessage={() => 'Please select at least one author.'}
    components={{
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
