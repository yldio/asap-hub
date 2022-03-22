import { ExternalAuthorResponse, UserResponse } from '@asap-hub/model';
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

  background: 'red',
});

type AuthorOption = {
  user: UserResponse | ExternalAuthorResponse;
} & MultiSelectOptionType;

type AuthorSelectProps = LabeledMultiSelectProps<AuthorOption>;

const AuthorSelect: React.FC<AuthorSelectProps> = (props) => (
  <LabeledMultiSelect<AuthorOption>
    {...props}
    components={{
      MultiValueLabel: (props) => (
        <components.MultiValueLabel {...props}>
          <div css={optionStyles}>
            <Avatar
              firstName={props.data.label.toString()}
              lastName={props.data.label.toString().split(' ')[1]}
              imageUrl={props.data.icon}
            />
            {props.children}
          </div>
        </components.MultiValueLabel>
      ),
      Option: (props) => (
        <components.Option {...props}>
          <div css={optionStyles}>
            <Avatar
              firstName={props.label}
              lastName={props.label.split(' ')[1]}
              imageUrl={props.data.icon}
            />
            {props.children}
          </div>
        </components.Option>
      ),
    }}
  />
);

export default AuthorSelect;
