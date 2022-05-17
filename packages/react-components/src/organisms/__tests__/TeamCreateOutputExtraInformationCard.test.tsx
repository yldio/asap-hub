import { ComponentProps } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { researchTagResponse } from '@asap-hub/fixtures';
import TeamCreateOutputExtraInformationCard from '../TeamCreateOutputExtraInformationCard';

const props: ComponentProps<typeof TeamCreateOutputExtraInformationCard> = {
  isSaving: false,
  tagSuggestions: [],
  tags: [],
  methods: [],
  documentType: 'Article',
  identifierRequired: false,
  type: 'Protein Data',
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
      tagSuggestions={[{ label: 'Example', value: 'Example' }]}
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

it('should show lab catalogue number for lab resources', () => {
  const { queryByLabelText, rerender } = render(
    <TeamCreateOutputExtraInformationCard
      {...props}
      documentType={'Article'}
    />,
  );
  expect(queryByLabelText(/Catalog Number/i)).toBeNull();
  rerender(
    <TeamCreateOutputExtraInformationCard
      {...props}
      documentType={'Lab Resource'}
    />,
  );
  expect(queryByLabelText(/Catalog Number/i)).toBeVisible();
});

it('should hide methods when there is no suggestions', () => {
  const { queryByLabelText } = render(
    <TeamCreateOutputExtraInformationCard {...props} />,
  );
  expect(queryByLabelText(/Methods/i)).toBeNull();
});

it('should trigger an onChange event when a method is selected', async () => {
  const mockOnChange = jest.fn();
  const { getByText, getByLabelText } = render(
    <TeamCreateOutputExtraInformationCard
      {...props}
      getResearchTags={() => Promise.resolve([researchTagResponse])}
      onChangeMethods={mockOnChange}
    />,
  );

  await waitFor(() => {
    expect(getByLabelText(/method/i)).toBeVisible();
  });

  userEvent.click(getByLabelText(/method/i));
  userEvent.click(getByText('Activity Assay'));
  expect(mockOnChange).toHaveBeenCalledWith(['Activity Assay']);
});
