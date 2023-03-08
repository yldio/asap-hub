import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import { waitFor } from '@testing-library/dom';

import ResearchOutputRelatedOutputsCard from '../ResearchOutputRelatedOutputsCard';

const props: ComponentProps<typeof ResearchOutputRelatedOutputsCard> = {
  relatedResearch: [],
  isSaving: false,
};

it('renders the contributors card form', async () => {
  const { getByText } = render(
    <StaticRouter>
      <ResearchOutputRelatedOutputsCard {...props} />
    </StaticRouter>,
  );
  expect(getByText(/Are there any related outputs/i)).toBeVisible();
});

describe('Related Research Multiselect', () => {
  it('should render provided values', () => {
    const { getByText } = render(
      <ResearchOutputRelatedOutputsCard
        {...props}
        relatedResearch={[
          { label: 'First Related Research', value: '1' },
          { label: 'Second Related Research', value: '2' },
        ]}
      />,
    );
    expect(getByText(/first related/i)).toBeVisible();
    expect(getByText(/second related/i)).toBeVisible();
  });
  it('should be able to select from the list of options', async () => {
    const loadOptions = jest.fn();
    const mockOnChange = jest.fn();
    loadOptions.mockResolvedValue([
      { label: 'First Related Research', value: '1' },
      { label: 'Second Related Research', value: '2' },
    ]);

    const { getByText, getByLabelText, queryByText } = render(
      <ResearchOutputRelatedOutputsCard
        {...props}
        getRelatedResearchSuggestions={loadOptions}
        onChangeRelatedResearch={mockOnChange}
      />,
    );
    userEvent.click(getByLabelText(/related/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    userEvent.click(getByText('First Related Research'));
    expect(mockOnChange).toHaveBeenCalledWith([
      { label: 'First Related Research', value: '1' },
    ]);
  });
  it('should render message when there is no match', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([]);
    const { getByLabelText, queryByText } = render(
      <ResearchOutputRelatedOutputsCard
        {...props}
        getRelatedResearchSuggestions={loadOptions}
      />,
    );
    userEvent.click(getByLabelText(/related/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(queryByText(/no related outputs match/i)).toBeInTheDocument();
  });
});
