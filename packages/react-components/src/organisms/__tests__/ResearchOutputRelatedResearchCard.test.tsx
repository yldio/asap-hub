import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import { waitFor } from '@testing-library/dom';

import ResearchOutputRelatedResearchCard from '../ResearchOutputRelatedResearchCard';

const props: ComponentProps<typeof ResearchOutputRelatedResearchCard> = {
  relatedResearch: [],
  isSaving: false,
};

it('renders the contributors card form', async () => {
  const { getByText } = render(
    <StaticRouter>
      <ResearchOutputRelatedResearchCard {...props} />
    </StaticRouter>,
  );
  expect(getByText(/Are there any related outputs/i)).toBeVisible();
});

describe('Related Research Multiselect', () => {
  it('should render provided values with and type when documentType is Article', () => {
    const { getByText } = render(
      <ResearchOutputRelatedResearchCard
        {...props}
        relatedResearch={[
          {
            label: 'First Related Research',
            value: '1',
            type: '3D Printing',
            documentType: 'Report',
          },
          {
            label: 'Second Related Research',
            value: '2',
            type: 'Preprint',
            documentType: 'Article',
          },
        ]}
      />,
    );
    expect(getByText(/first related/i)).toBeVisible();
    expect(getByText(/second related/i)).toBeVisible();
    expect(getByText(/preprint/i)).toBeVisible();
  });
  it('should be able to select from the list of options', async () => {
    const loadOptions = jest.fn();
    const mockOnChange = jest.fn();
    loadOptions.mockResolvedValue([
      { label: 'First Related Research', value: '1' },
      { label: 'Second Related Research', value: '2' },
    ]);

    const { getByText, getByLabelText, queryByText } = render(
      <ResearchOutputRelatedResearchCard
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
      <ResearchOutputRelatedResearchCard
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
