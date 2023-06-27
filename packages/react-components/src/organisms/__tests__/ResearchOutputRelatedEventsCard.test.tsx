import { render, waitFor } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import userEvent from '@testing-library/user-event';

import ResearchOutputRelatedEventsCard, {
  ResearchOutputRelatedEventsOption,
} from '../ResearchOutputRelatedEventsCard';

const props: ComponentProps<typeof ResearchOutputRelatedEventsCard> = {
  relatedEvents: [],
  isSaving: false,
  isEditMode: false,
};

it('renders the related events card', async () => {
  const { getByRole } = render(
    <StaticRouter>
      <ResearchOutputRelatedEventsCard {...props} />
    </StaticRouter>,
  );
  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    'Are there any related CRN Hub events?',
  );
});

it('should render message when there is no match', async () => {
  const loadOptions = jest.fn();
  loadOptions.mockResolvedValue([]);
  const { getByLabelText, queryByText } = render(
    <ResearchOutputRelatedEventsCard
      {...props}
      getRelatedEventSuggestions={loadOptions}
    />,
  );
  userEvent.click(getByLabelText(/Hub Events/i));
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

  const { getByLabelText, queryByText, getByText } = render(
    <ResearchOutputRelatedEventsCard
      {...props}
      getRelatedEventSuggestions={jest.fn().mockResolvedValue(result)}
      onChangeRelatedEvents={mockOnChange}
    />,
  );
  userEvent.click(getByLabelText(/Hub Events/i));
  await waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument());
  userEvent.click(getByText('Event 1'));
  expect(mockOnChange).toHaveBeenCalledWith(result);
});
