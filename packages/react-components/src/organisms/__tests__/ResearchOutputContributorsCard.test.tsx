import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router';
import { ReactElement } from 'react';
import { waitFor } from '@testing-library/dom';
import { createUserResponse } from '@asap-hub/fixtures';

import ResearchOutputContributorsCard from '../ResearchOutputContributorsCard';
import { renderWithResearchOutputForm } from '../test-utils/research-output-form';
import { ResearchOutputFormValues } from '../../utils';

const renderContributors = (
  ui: ReactElement,
  options?: { defaultValues?: Partial<ResearchOutputFormValues> },
) =>
  renderWithResearchOutputForm(
    <StaticRouter location="/">{ui}</StaticRouter>,
    options,
  );

it('renders the contributors card form', async () => {
  const { getByText } = renderContributors(<ResearchOutputContributorsCard />);
  expect(getByText(/Who were the contributors/i)).toBeVisible();
});

describe('Authors Multiselect', () => {
  it('updates authors form value', async () => {
    const getAuthorSuggestions = jest.fn();
    getAuthorSuggestions.mockResolvedValue([
      { author: createUserResponse(), label: 'Author Two', value: '2' },
      { author: createUserResponse(), label: 'Author One', value: '1' },
    ]);

    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard
        getAuthorSuggestions={getAuthorSuggestions}
      />,
    );

    await userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    await userEvent.click(screen.getByText('Author Two'));

    expect(methodsRef.current?.getValues('authors')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Author Two', value: '2' }),
      ]),
    );
  });
});

describe('Labs Multiselect', () => {
  it('should render provided values', () => {
    const { getByText } = renderContributors(
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
  it('should be able to select from the list of options', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);
    const { getByText, getByLabelText, queryByText, methodsRef } =
      renderContributors(
        <ResearchOutputContributorsCard getLabSuggestions={loadOptions} />,
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
  it('should render message when there is no match', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([]);
    const { getByLabelText, queryByText } = renderContributors(
      <ResearchOutputContributorsCard getLabSuggestions={loadOptions} />,
    );
    await userEvent.click(getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(queryByText(/no labs match/i)).toBeInTheDocument();
  });

  it('updates labs form value', async () => {
    const getLabSuggestions = jest.fn();
    getLabSuggestions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);

    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard getLabSuggestions={getLabSuggestions} />,
    );

    await userEvent.click(screen.getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    await userEvent.click(screen.getByText('One Lab'));

    expect(methodsRef.current?.getValues('labs')).toEqual([
      { label: 'One Lab', value: '1' },
    ]);
  });

  it('shows a required error when no labs are selected and clears it once a lab is added', async () => {
    const getLabSuggestions = jest.fn();
    getLabSuggestions.mockResolvedValue([{ label: 'One Lab', value: '1' }]);

    const { getByLabelText, queryByText, findByText } = renderContributors(
      <ResearchOutputContributorsCard getLabSuggestions={getLabSuggestions} />,
      { defaultValues: { labs: [] } },
    );

    const labsInput = getByLabelText(/Labs\(required\)/i);

    await userEvent.click(labsInput);
    await userEvent.keyboard('{Escape}');
    await userEvent.tab();

    expect(await findByText('Please add at least one lab.')).toBeVisible();

    await userEvent.click(labsInput);
    await userEvent.click(await findByText('One Lab'));

    await waitFor(() =>
      expect(
        queryByText('Please add at least one lab.'),
      ).not.toBeInTheDocument(),
    );
  });
});

describe('Teams Multiselect', () => {
  it('should render provided values', () => {
    const { getByText } = renderContributors(
      <ResearchOutputContributorsCard />,
      {
        defaultValues: {
          teams: [
            { label: 'Team One', value: '1' },
            { label: 'Team Two', value: '2' },
          ],
        },
      },
    );
    expect(getByText(/team one/i)).toBeVisible();
    expect(getByText(/team two/i)).toBeVisible();
  });
  it('should be able to select from the list of options', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([
      { label: 'Team One', value: '1' },
      { label: 'Team Two', value: '2' },
    ]);

    const { getByText, getByLabelText, queryByText, methodsRef } =
      renderContributors(
        <ResearchOutputContributorsCard getTeamSuggestions={loadOptions} />,
      );
    await userEvent.click(getByLabelText(/teams\(required\)/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    await userEvent.click(getByText('Team One'));
    expect(methodsRef.current?.getValues('teams')).toEqual([
      { label: 'Team One', value: '1' },
    ]);
  });
  it('should render message when there is no match', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([]);
    const { getByLabelText, queryByText } = renderContributors(
      <ResearchOutputContributorsCard getTeamSuggestions={loadOptions} />,
    );
    await userEvent.click(getByLabelText(/Teams\(required\)/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(queryByText(/no teams match/i)).toBeInTheDocument();
  });
});
