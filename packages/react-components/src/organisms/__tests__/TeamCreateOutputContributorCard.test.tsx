import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import TeamCreateOutputContributorsCard from '../TeamCreateOutputContributorsCard';

const props: ComponentProps<typeof TeamCreateOutputContributorsCard> = {
  labSuggestions: jest.fn(),
  onChangeLabs: jest.fn(),
  labs: [],
  authorSuggestions: jest.fn(),
  onChangeAuthors: jest.fn(),
  authors: [],
  isSaving: false,
};

describe('Labs', () => {
  it('should render lab placeholder when no value is selected', async () => {
    const { findAllByText } = render(
      <TeamCreateOutputContributorsCard {...props} />,
    );

    const elements = await findAllByText(/start typing/i);

    expect(elements[0]).toBeVisible();
    expect(elements[1]).toBeVisible();
  });
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
  it('should be able to select lab from the list of options', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockReturnValue(
      new Promise((resolve) =>
        resolve([
          { label: 'One Lab', value: '1' },
          { label: 'Two Lab', value: '2' },
        ]),
      ),
    );

    const { getByText, getByLabelText, queryByText } = render(
      <TeamCreateOutputContributorsCard
        {...props}
        labSuggestions={loadOptions}
      />,
    );
    userEvent.click(getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    userEvent.click(getByText('One Lab'));
    expect(props.onChangeLabs).toHaveBeenCalledWith([
      { label: 'One Lab', value: '1' },
    ]);
  });
  it('should be able to select author from the list of options', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([
      { label: 'Author One', value: '1' },
      { label: 'Author Two', value: '2' },
    ]);

    const { getByText, getByLabelText, queryByText } = render(
      <TeamCreateOutputContributorsCard
        {...props}
        authorSuggestions={loadOptions}
      />,
    );
    userEvent.click(getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    userEvent.click(getByText('Author One'));
    expect(props.onChangeAuthors).toHaveBeenCalledWith([
      { label: 'Author One', value: '1' },
    ]);
  });
  it('should render message when there is no match', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockReturnValue(new Promise((resolve) => resolve([])));
    const { getByLabelText, queryByText } = render(
      <TeamCreateOutputContributorsCard
        {...props}
        labSuggestions={loadOptions}
      />,
    );
    userEvent.click(getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(queryByText(/no labs match/i)).toBeInTheDocument();
  });
});
