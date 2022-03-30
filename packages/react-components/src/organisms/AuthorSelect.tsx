import { ExternalAuthorResponse, UserResponse } from '@asap-hub/model';
import { isInternalUser } from '@asap-hub/validation';
import { css } from '@emotion/react';
import { ReactElement, ReactNode } from 'react';
import { components } from 'react-select';
import { Avatar } from '../atoms';
import { userPlaceholderIcon } from '../icons';
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
  children,
}: {
  author: UserResponse | ExternalAuthorResponse;
  children: ReactElement | ReactNode;
}) =>
  isInternalUser(author) ? (
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
      <span>{children} (Non CRN)</span>
    </>
  );

const optionStyles = css({
  display: 'grid',

  gridTemplateColumns: `${24 / perRem}em 1fr`,
  gridColumnGap: `${8 / perRem}em`,
});

type AuthorOption = {
  user: UserResponse | ExternalAuthorResponse;
} & MultiSelectOptionsType;

type AuthorSelectProps = LabeledMultiSelectProps<AuthorOption>;

const AuthorSelect: React.FC<AuthorSelectProps> = (props) => (
  <LabeledMultiSelect<AuthorOption>
    {...props}
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
            <LabelWithAvatar author={multiValueLabelProps.data.user}>
              {multiValueLabelProps.children}
            </LabelWithAvatar>
          </div>
        </components.MultiValueLabel>
      ),
      Option: (optionProps) => (
        <components.Option {...optionProps}>
          <div css={optionStyles}>
            <LabelWithAvatar author={optionProps.data.user}>
              {optionProps.children}
            </LabelWithAvatar>
          </div>
        </components.Option>
      ),
    }}
  />
);

export default AuthorSelect;
