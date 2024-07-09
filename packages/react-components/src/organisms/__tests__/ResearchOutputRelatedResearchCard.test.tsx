import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import { waitFor } from '@testing-library/dom';

import ResearchOutputRelatedResearchCard from '../ResearchOutputRelatedResearchCard';

const props: ComponentProps<typeof ResearchOutputRelatedResearchCard> = {
  relatedResearch: [],
  isSaving: false,
  getIconForDocumentType: jest.fn(),
};

it('renders the contributors card form', async () => {
  const { getByText } = render(
    <MemoryRouter>
      <ResearchOutputRelatedResearchCard {...props} />
    </MemoryRouter>,
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
    ]);

    const { getByText, getByRole, queryByText } = render(
      <ResearchOutputRelatedResearchCard
        {...props}
        getRelatedResearchSuggestions={loadOptions}
        onChangeRelatedResearch={mockOnChange}
      />,
    );
    await userEvent.click(getByRole('textbox', { name: /related/i }));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(getByText(/preprint/i)).toBeVisible();
    await userEvent.click(getByText('First Related Research'));
    expect(mockOnChange).toHaveBeenCalledWith([
      {
        label: 'First Related Research',
        value: '1',
        type: '3D Printing',
        documentType: 'Report',
      },
    ]);
  });
  it('should render message when there is no match', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([]);
    const { queryByText, getByRole } = render(
      <ResearchOutputRelatedResearchCard
        {...props}
        getRelatedResearchSuggestions={loadOptions}
      />,
    );
    await userEvent.click(getByRole('textbox', { name: /related/i }));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(queryByText(/no related outputs match/i)).toBeInTheDocument();
  });
});
