import { ComponentProps } from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TeamCreateOutputExtraInformationCard from '../TeamCreateOutputExtraInformationCard';

const props: ComponentProps<typeof TeamCreateOutputExtraInformationCard> = {
  isSaving: false,
  tagSuggestions: [],
  tags: [],
};

it('should render a tag', () => {
  const { getByText } = render(
    <TeamCreateOutputExtraInformationCard {...props} tags={['example']} />,
  );
  expect(getByText(/example/i)).toBeVisible();
});

it('should trigger an onChange event when a tag is selected', () => {
  const mockOnChange = jest.fn();
  const { getByText, getByLabelText } = render(
    <TeamCreateOutputExtraInformationCard
      {...props}
      tagSuggestions={['Example']}
      onChangeTags={mockOnChange}
    />,
  );
  userEvent.click(getByLabelText(/keyword/i));
  userEvent.click(getByText('Example'));
  expect(mockOnChange).toHaveBeenCalledWith(['Example']);
});

it('should trigger an onChange event when a text is being typed into access instructions', () => {
  const mockOnChange = jest.fn();
  const { getByText, getByLabelText } = render(
    <TeamCreateOutputExtraInformationCard
      {...props}
      accessInstructions="access-instructions-value"
      onChangeAccessInstructions={mockOnChange}
    />,
  );

  expect(getByText('access-instructions-value')).toBeVisible();

  const input = getByLabelText(/access instructions/i);
  fireEvent.change(input, { target: { value: 'test' } });
  expect(mockOnChange).toHaveBeenLastCalledWith('test');
});
