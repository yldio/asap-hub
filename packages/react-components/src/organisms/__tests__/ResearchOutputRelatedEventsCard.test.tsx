import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import userEvent from '@testing-library/user-event';

import ResearchOutputRelatedEventsCard, {
  ResearchOutputRelatedEventsOption,
} from '../ResearchOutputRelatedEventsCard';

const props: ComponentProps<typeof ResearchOutputRelatedEventsCard> = {
  relatedEvents: [],
  isSaving: false,
  isEditMode: false,
  getRelatedEventSuggestions: jest.fn(),
  onChangeRelatedEvents: jest.fn(),
};

it('renders the related events card', async () => {
  const { getByRole } = render(
    <MemoryRouter>
      <ResearchOutputRelatedEventsCard {...props} />
    </MemoryRouter>,
  );
  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    'Are there any related CRN Hub events?',
  );
});

it('should render message when there is no match', async () => {
  const loadOptions = jest.fn();
  loadOptions.mockResolvedValue([]);
  const { getByRole, queryByText } = render(
    <ResearchOutputRelatedEventsCard
      {...props}
      getRelatedEventSuggestions={loadOptions}
    />,
  );
  await userEvent.click(getByRole('textbox', { name: /Hub Events/i }));
  await waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument());
  expect(queryByText(/no related events match/i)).toBeInTheDocument();
});

it('Can select an option', async () => {
  const result: ResearchOutputRelatedEventsOption[] = [
    {
      endDate: new Date('2020-01-01').toISOString(),
      value: 'e1',
      label: 'Event 1',
    },
  ];
  const mockOnChange = jest.fn();

  const { getByRole, queryByText, getByText } = render(
    <ResearchOutputRelatedEventsCard
      {...props}
      getRelatedEventSuggestions={jest.fn().mockResolvedValue(result)}
      onChangeRelatedEvents={mockOnChange}
    />,
  );
  await userEvent.click(getByRole('textbox', { name: /Hub Events/i }));
  await waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument());
  await userEvent.click(getByText('Event 1'));
  expect(mockOnChange).toHaveBeenCalledWith(result);
});
