import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { createUserResponse } from '@asap-hub/fixtures';
import ResearchOutputContributorsCard from '../ResearchOutputContributorsCard';

const props: ComponentProps<typeof ResearchOutputContributorsCard> = {
  labs: [],
  authors: [],
  teams: [],
  isSaving: false,
};

describe('Labs', () => {
  it('should render lab placeholder when no value is selected', async () => {
    const { findAllByText } = render(
      <ResearchOutputContributorsCard {...props} />,
    );

    const elements = await findAllByText(/start typing/i);

    expect(elements[0]).toBeVisible();
    expect(elements[1]).toBeVisible();
  });
  it('should render provided values', () => {
    const { getByText } = render(
      <ResearchOutputContributorsCard
        {...props}
        labs={[
          { label: 'One Lab', value: '1' },
          { label: 'Two Lab', value: '2' },
        ]}
      />,
    );
    expect(getByText(/one lab/i)).toBeVisible();
    expect(getByText(/two lab/i)).toBeVisible();
  });
  it('should be able to select lab from the list of options', async () => {
    const mockGetLabSuggestions = jest.fn();
    const mockOnChange = jest.fn();
    mockGetLabSuggestions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);

    const { getByText, getByLabelText, queryByText } = render(
      <ResearchOutputContributorsCard
        {...props}
        onChangeLabs={mockOnChange}
        getLabSuggestions={mockGetLabSuggestions}
      />,
    );
    userEvent.click(getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    userEvent.click(getByText('One Lab'));
    expect(mockOnChange).toHaveBeenCalledWith([
      { label: 'One Lab', value: '1' },
    ]);
  });
  it('should be able to select author from the list of options', async () => {
    const loadOptions = jest.fn();
    const mockOnChange = jest.fn();
    loadOptions.mockResolvedValue([
      { author: createUserResponse(), label: 'Author One', value: '1' },
      { author: createUserResponse(), label: 'Author Two', value: '2' },
    ]);

    const { getByText, getByLabelText, queryByText } = render(
      <ResearchOutputContributorsCard
        {...props}
        onChangeAuthors={mockOnChange}
        getAuthorSuggestions={loadOptions}
      />,
    );
    userEvent.click(getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    userEvent.click(getByText('Author One'));
    expect(mockOnChange).toHaveBeenCalledWith([
      { author: createUserResponse(), label: 'Author One', value: '1' },
    ]);
  });
  it('should render message when there is no match', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockRejectedValue([]);
    const { getByLabelText, queryByText } = render(
      <ResearchOutputContributorsCard
        {...props}
        getLabSuggestions={loadOptions}
      />,
    );
    userEvent.click(getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(queryByText(/no labs match/i)).toBeInTheDocument();
  });
});
