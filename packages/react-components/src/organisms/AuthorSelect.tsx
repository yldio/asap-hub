import { ExternalAuthorResponse, UserResponse } from '@asap-hub/model';
import { isInternalUser } from '@asap-hub/validation';
import { css } from '@emotion/react';
import { components } from 'react-select';
import { Avatar } from '../atoms';
import { MultiSelectOptionType } from '../atoms/MultiSelect';
import LabeledMultiSelect, {
  LabeledMultiSelectProps,
} from '../molecules/LabeledMultiSelect';
import { perRem } from '../pixels';

const optionStyles = css({
  display: 'grid',

  gridTemplateColumns: `${24 / perRem}em 1fr`,
  gridColumnGap: `${8 / perRem}em`,
});

type AuthorOption = {
  user: UserResponse | ExternalAuthorResponse;
} & MultiSelectOptionType;

type AuthorSelectProps = LabeledMultiSelectProps<AuthorOption>;

const getFirstAndLastName = (user: UserResponse | ExternalAuthorResponse) => {
  if (isInternalUser(user)) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  return {
    firstName: user.displayName,
    lastName: user.displayName.split(' ')[1],
  };
};

const AuthorSelect: React.FC<AuthorSelectProps> = (props) => (
  <LabeledMultiSelect<AuthorOption>
    {...props}
    components={{
      MultiValueLabel: (multiValueLabelProps) => (
        <components.MultiValueLabel {...multiValueLabelProps}>
          <div css={optionStyles}>
            <Avatar
              {...getFirstAndLastName(multiValueLabelProps.data.user)}
              imageUrl={multiValueLabelProps.data.user?.avatarUrl}
            />
            <span>{multiValueLabelProps.children}</span>
          </div>
        </components.MultiValueLabel>
      ),
      Option: (optionProps) => (
        <components.Option {...optionProps}>
          <div css={optionStyles}>
            <Avatar
              {...getFirstAndLastName(optionProps.data.user)}
              imageUrl={optionProps.data.user?.avatarUrl}
            />
            <span>{optionProps.children}</span>
          </div>
        </components.Option>
      ),
    }}
  />
);

export default AuthorSelect;
