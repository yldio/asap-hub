import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { createUserResponse } from '@asap-hub/fixtures';
import ResearchOutputContributorsCard from '../ResearchOutputContributorsCard';
import { renderWithResearchOutputForm } from '../test-utils/research-output-form';

describe('Labs', () => {
  it('should render lab placeholder when no value is selected', async () => {
    const { findAllByText } = renderWithResearchOutputForm(
      <ResearchOutputContributorsCard />,
    );

    const elements = await findAllByText(/start typing/i);

    expect(elements[0]).toBeVisible();
    expect(elements[1]).toBeVisible();
  });
  it('should render provided values', () => {
    const { getByText } = renderWithResearchOutputForm(
      <ResearchOutputContributorsCard />,
      {
        defaultValues: {
          labs: [
            { label: 'One Lab', value: '1' },
            { label: 'Two Lab', value: '2' },
          ],
        },
      },
    );
    expect(getByText(/one lab/i)).toBeVisible();
    expect(getByText(/two lab/i)).toBeVisible();
  });
  it('should be able to select lab from the list of options', async () => {
    const mockGetLabSuggestions = jest.fn();
    mockGetLabSuggestions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);

    const { getByText, getByLabelText, queryByText, methodsRef } =
      renderWithResearchOutputForm(
        <ResearchOutputContributorsCard
          getLabSuggestions={mockGetLabSuggestions}
        />,
      );
    await userEvent.click(getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    await userEvent.click(getByText('One Lab'));
    expect(methodsRef.current?.getValues('labs')).toEqual([
      { label: 'One Lab', value: '1' },
    ]);
  });
  it('should be able to select author from the list of options', async () => {
    const loadOptions = jest.fn();
    const authorOne = createUserResponse();
    loadOptions.mockResolvedValue([
      { author: authorOne, label: 'Author One', value: '1' },
      { author: createUserResponse(), label: 'Author Two', value: '2' },
    ]);

    const { getByText, getByLabelText, queryByText, methodsRef } =
      renderWithResearchOutputForm(
        <ResearchOutputContributorsCard getAuthorSuggestions={loadOptions} />,
      );
    await userEvent.click(getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    await userEvent.click(getByText('Author One'));
    expect(methodsRef.current?.getValues('authors')).toEqual([
      { author: authorOne, label: 'Author One', value: '1' },
    ]);
  });
  it('should render message when there is no match', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockRejectedValue([]);
    const { getByLabelText, queryByText } = renderWithResearchOutputForm(
      <ResearchOutputContributorsCard getLabSuggestions={loadOptions} />,
    );
    await userEvent.click(getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(queryByText(/no labs match/i)).toBeInTheDocument();
  });
});
