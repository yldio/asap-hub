import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import { waitFor } from '@testing-library/dom';

import TeamCreateOutputContributorsCard from '../TeamCreateOutputContributorsCard';

const props: ComponentProps<typeof TeamCreateOutputContributorsCard> = {
  authors: [],
  labs: [],
  teams: [],
  isSaving: false,
};

it('renders the contributors card form', async () => {
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputContributorsCard {...props} />
    </StaticRouter>,
  );
  expect(getByText(/Who were the contributors/i)).toBeVisible();
});

describe('Authors Multiselect', () => {
  it('calls onChangeAuthors function', async () => {
    const onChangeAuthors = jest.fn();
    const getAuthorSuggestions = jest.fn();
    getAuthorSuggestions.mockResolvedValue([
      { label: 'Author Two', value: '2' },
      { label: 'Author One', value: '1' },
    ]);

    render(
      <StaticRouter>
        <TeamCreateOutputContributorsCard
          {...props}
          onChangeAuthors={onChangeAuthors}
          getAuthorSuggestions={getAuthorSuggestions}
        />
      </StaticRouter>,
    );

    userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    userEvent.click(screen.getByText('Author Two'));

    expect(onChangeAuthors).toBeCalled();
  });
});

describe('Labs Multiselect', () => {
  it('should render provided values', () => {
    const { getByText } = render(
      <TeamCreateOutputContributorsCard
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
  it('should be able to select from the list of options', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);
    const mockOnChange = jest.fn();
    const { getByText, getByLabelText, queryByText } = render(
      <TeamCreateOutputContributorsCard
        {...props}
        onChangeLabs={mockOnChange}
        getLabSuggestions={loadOptions}
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
  it('should render message when there is no match', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([]);
    const { getByLabelText, queryByText } = render(
      <TeamCreateOutputContributorsCard
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

  it('calls onChangeLabs function', async () => {
    const onChangeLabs = jest.fn();
    const getLabSuggestions = jest.fn();
    getLabSuggestions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);

    render(
      <StaticRouter>
        <TeamCreateOutputContributorsCard
          {...props}
          onChangeLabs={onChangeLabs}
          getLabSuggestions={getLabSuggestions}
        />
      </StaticRouter>,
    );

    userEvent.click(screen.getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    userEvent.click(screen.getByText('One Lab'));

    expect(onChangeLabs).toBeCalled();
  });
});

describe('Teams Multiselect', () => {
  it('should render provided values', () => {
    const { getByText } = render(
      <TeamCreateOutputContributorsCard
        {...props}
        teams={[
          { label: 'One Team', value: '1' },
          { label: 'Two Team', value: '2' },
        ]}
      />,
    );
    expect(getByText(/one team/i)).toBeVisible();
    expect(getByText(/two team/i)).toBeVisible();
  });
  it('should be able to select from the list of options', async () => {
    const loadOptions = jest.fn();
    const mockOnChange = jest.fn();
    loadOptions.mockResolvedValue([
      { label: 'One Team', value: '1' },
      { label: 'Two Team', value: '2' },
    ]);

    const { getByText, getByLabelText, queryByText } = render(
      <TeamCreateOutputContributorsCard
        {...props}
        getTeamSuggestions={loadOptions}
        onChangeTeams={mockOnChange}
      />,
    );
    userEvent.click(getByLabelText(/teams/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    userEvent.click(getByText('One Team'));
    expect(mockOnChange).toHaveBeenCalledWith([
      { label: 'One Team', value: '1' },
    ]);
  });
  it('should render message when there is no match', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([]);
    const { getByLabelText, queryByText } = render(
      <TeamCreateOutputContributorsCard
        {...props}
        getTeamSuggestions={loadOptions}
      />,
    );
    userEvent.click(getByLabelText(/Teams/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(queryByText(/no teams match/i)).toBeInTheDocument();
  });
});
