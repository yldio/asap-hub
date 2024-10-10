import { createUserResponse } from '@asap-hub/fixtures';
import { AuthorAlgoliaResponse, ManuscriptFormData } from '@asap-hub/model';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { useForm } from 'react-hook-form';
import ManuscriptAuthors from '../ManuscriptAuthors';

const author: AuthorAlgoliaResponse = {
  ...createUserResponse(),
  __meta: { type: 'user' },
};
const getAuthorSuggestions = jest.fn();
getAuthorSuggestions.mockResolvedValue([
  { author, label: 'Author Two', value: '2' },
  { author, label: 'Author One', value: '1' },
]);

const defaultProps: Omit<
  ComponentProps<typeof ManuscriptAuthors>,
  'control' | 'getValues' | 'trigger'
> = {
  isMultiSelect: true,
  fieldName: 'firstAuthors',
  fieldTitle: 'First Authors',
  fieldDescription: 'Add the first authors of the manuscript',
  fieldEmailDescription: 'Provide their email',
  getAuthorSuggestions,
  isSubmitting: false,
};

const ManuscriptAuthorsComponent = (
  props: Partial<ComponentProps<typeof ManuscriptAuthors>>,
) => {
  const { control, getValues, trigger } = useForm<ManuscriptFormData>();

  return (
    <ManuscriptAuthors
      {...defaultProps}
      control={control}
      getValues={getValues}
      trigger={trigger}
      {...props}
    />
  );
};

it.each([true, false])(
  'displays external author email input field for a non existing external author when isMultiSelect is %s',
  async (isMultiSelect) => {
    render(<ManuscriptAuthorsComponent isMultiSelect={isMultiSelect} />);

    userEvent.type(screen.getByRole('textbox'), 'Jane Doe');

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Jane Doe/i, { selector: 'strong' })).toBeVisible();
    expect(screen.getByText(/(Non CRN)/i, { selector: 'span' })).toBeVisible();

    userEvent.click(screen.getByText(/Non CRN/i));

    expect(screen.getByText(/Jane Doe Email/i)).toBeInTheDocument();
  },
);

it.each([true, false])(
  'displays external author email input field for an existing external author when isMultiSelect is %s',
  async (isMultiSelect) => {
    const externalAuthor: AuthorAlgoliaResponse = {
      id: 'external-1',
      displayName: 'External',
      __meta: { type: 'external-author' },
    };

    const getAuthorSuggestionsMock = jest.fn();
    getAuthorSuggestionsMock.mockResolvedValue([
      { author, label: 'Author Two', value: '2' },
      { author, label: 'Author One', value: '1' },
      { author: externalAuthor, label: 'External Author', value: '3' },
    ]);

    render(
      <ManuscriptAuthorsComponent
        getAuthorSuggestions={getAuthorSuggestionsMock}
        isMultiSelect={isMultiSelect}
      />,
    );

    userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    userEvent.click(screen.getByText(/External Author/i));

    expect(screen.getByText(/External Author Email/i)).toBeInTheDocument();
  },
);

it.each([true, false])(
  'when user removes the external author and isMultiSelect is %s, its email input field should disappear',
  async (isMultiSelect) => {
    render(<ManuscriptAuthorsComponent isMultiSelect={isMultiSelect} />);

    userEvent.type(screen.getByRole('textbox'), 'Jane Doe');

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    userEvent.click(screen.getByText(/Non CRN/i));

    expect(screen.getByText(/Jane Doe Email/i)).toBeInTheDocument();

    const authorElement = screen.getByText(/Non CRN/i);
    const container = authorElement.parentElement?.parentElement?.parentElement;
    const closeButton = within(container!).getByTitle('Close');
    userEvent.click(closeButton);

    expect(screen.queryByText(/Jane Doe Email/i)).not.toBeInTheDocument();
  },
);

it.each([true, false])(
  'displays error message when no author is found and isMultiSelect is %s',
  async (isMultiSelect) => {
    render(
      <ManuscriptAuthorsComponent
        isMultiSelect={isMultiSelect}
        getAuthorSuggestions={jest.fn().mockResolvedValue([])}
      />,
    );

    userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    expect(screen.getByText(/Sorry, no authors match/i)).toBeVisible();
  },
);

describe('Multiple Option Selection', () => {
  it('should allow more than one author when is isMultiSelect is true', async () => {
    render(<ManuscriptAuthorsComponent />);

    userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    userEvent.click(screen.getByText('Author Two'));

    expect(screen.getByText(/Author Two/i)).toBeInTheDocument();
    expect(screen.queryByText(/Author One/i)).not.toBeInTheDocument();

    userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    userEvent.click(screen.getByText('Author One'));

    expect(screen.getByText(/Author One/i)).toBeInTheDocument();
    expect(screen.getByText(/Author Two/i)).toBeInTheDocument();
  });

  it('when user removes internal author, the external author email input field does not disappear', async () => {
    render(<ManuscriptAuthorsComponent />);

    userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    userEvent.click(screen.getByText('Author Two'));

    userEvent.type(screen.getByRole('textbox'), 'Jane Doe');

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    userEvent.click(screen.getByText(/Non CRN/i));

    expect(screen.getByText(/Jane Doe Email/i)).toBeInTheDocument();

    const authorElement = screen.getByText(/Author Two/i);
    const container = authorElement.parentElement?.parentElement?.parentElement;
    const closeButton = within(container!).getByTitle('Close');
    userEvent.click(closeButton);

    expect(screen.getByText(/Jane Doe Email/i)).toBeInTheDocument();
  });
});

describe('Single Option Selection', () => {
  it('should allow only one author when is isMultiSelect is false', async () => {
    render(<ManuscriptAuthorsComponent isMultiSelect={false} />);

    userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    userEvent.click(screen.getByText('Author Two'));

    expect(screen.getByText(/Author Two/i)).toBeInTheDocument();
    expect(screen.queryByText(/Author One/i)).not.toBeInTheDocument();

    userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    userEvent.click(screen.getByText('Author One'));

    expect(screen.getByText(/Author One/i)).toBeInTheDocument();
    expect(screen.queryByText(/Author Two/i)).not.toBeInTheDocument();
  });
});
