import { render, screen, waitFor } from '@testing-library/react';
import { ComponentProps } from 'react';
import { MemoryRouter, Route, Router, StaticRouter } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';

import userEvent, { specialChars } from '@testing-library/user-event';
import {
  manuscriptFormFieldsMapping,
  ManuscriptLifecycle,
  ManuscriptType,
  manuscriptTypeLifecycles,
} from '@asap-hub/model';
import ManuscriptForm from '../ManuscriptForm';

let history!: History;

beforeEach(() => {
  history = createMemoryHistory();
});

const teamId = '42';

const defaultProps: ComponentProps<typeof ManuscriptForm> = {
  onSave: jest.fn(() => Promise.resolve()),
  onSuccess: jest.fn(),
  teamId,
};

it('renders the form', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('heading', { name: /What are you sharing/i }),
  ).toBeVisible();
  expect(screen.getByRole('button', { name: /Submit/i })).toBeVisible();
});

it('data is sent on form submission', async () => {
  const onSave = jest.fn();
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        title="manuscript title"
        type="Original Research"
        lifecycle="Draft manuscript (prior to preprint submission)"
        onSave={onSave}
      />
    </StaticRouter>,
  );

  userEvent.click(screen.getByRole('button', { name: /Submit/i }));
  await waitFor(() => {
    expect(onSave).toHaveBeenCalledWith({
      title: 'manuscript title',
      versions: [
        {
          type: 'Original Research',
          lifecycle: 'Draft manuscript (prior to preprint submission)',
        },
      ],
      teamId,
    });
  });
});

it('does not display the lifecycle select box until type is selected', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );
  expect(
    screen.queryByLabelText(/Where is the manuscript in the life cycle/i),
  ).not.toBeInTheDocument();

  const textbox = screen.getByRole('textbox', { name: /Type of Manuscript/i });
  userEvent.type(textbox, 'Original');
  userEvent.type(textbox, specialChars.enter);
  textbox.blur();

  expect(
    screen.getByRole('textbox', {
      name: /Where is the manuscript in the life cycle/i,
    }),
  ).toBeInTheDocument();
});

const manuscriptTypeLifecyclesFlat = manuscriptTypeLifecycles.flatMap(
  ({ types, lifecycle }) => types.map((type) => ({ type, lifecycle })),
);
it.each(manuscriptTypeLifecyclesFlat)(
  'displays $lifecycle lifecycle option for when $type type is selected',
  async ({ lifecycle, type }) => {
    render(
      <StaticRouter>
        <ManuscriptForm {...defaultProps} type={type} lifecycle="" />
      </StaticRouter>,
    );

    const lifecycleTextbox = screen.getByRole('textbox', {
      name: /Where is the manuscript in the life cycle/i,
    });
    userEvent.click(lifecycleTextbox);

    expect(screen.getByText(lifecycle)).toBeVisible();
  },
);

it('displays error message when manuscript title is missing', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );

  const input = screen.getByRole('textbox', { name: /Title of Manuscript/i });
  const submitButton = screen.getByRole('button', { name: /Submit/i });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });
  expect(
    screen.getAllByText(/Please enter a title/i).length,
  ).toBeGreaterThanOrEqual(1);

  userEvent.type(input, 'title');

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });
  expect(screen.queryByText(/Please enter a title/i)).toBeNull();
});

it('displays error message when no type was found', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );

  const textbox = screen.getByRole('textbox', { name: /Type of Manuscript/i });
  userEvent.type(textbox, 'invalid type');

  expect(screen.getByText(/Sorry, no types match/i)).toBeVisible();
});

it('displays error message when no lifecycle was found', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );

  const typeTextbox = screen.getByRole('textbox', {
    name: /Type of Manuscript/i,
  });
  userEvent.type(typeTextbox, 'Original');
  userEvent.type(typeTextbox, specialChars.enter);
  typeTextbox.blur();

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  userEvent.type(lifecycleTextbox, 'invalid lifecycle');

  expect(screen.getByText(/Sorry, no options match/i)).toBeVisible();
});

it('displays error message when manuscript title is bigger than 256 characters', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );

  const input = screen.getByRole('textbox', {
    name: /Title of Manuscript/i,
  });
  userEvent.type(
    input,
    "Advancements in Parkinson's Disease Research: Investigating the Role of Genetic Mutations and DNA Sequencing Technologies in Unraveling the Molecular Mechanisms, Identifying Biomarkers, and Developing Targeted Therapies for Improved Diagnosis and Treatment of Parkinson Disease",
  );

  const submitButton = screen.getByRole('button', { name: /Submit/i });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });

  expect(
    screen.getAllByText(/This title cannot exceed 256 characters./i).length,
  ).toBeGreaterThanOrEqual(1);
});

it('displays error message when other details is bigger than 256 characters', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        title="Manuscript"
        type="Original Research"
        lifecycle="Other"
      />
    </StaticRouter>,
  );

  const input = screen.getByRole('textbox', {
    name: /Please provide details/i,
  });
  userEvent.type(
    input,
    "Advancements in Parkinson's Disease Research: Investigating the Role of Genetic Mutations and DNA Sequencing Technologies in Unraveling the Molecular Mechanisms, Identifying Biomarkers, and Developing Targeted Therapies for Improved Diagnosis and Treatment of Parkinson Disease",
  );

  const submitButton = screen.getByRole('button', { name: /Submit/i });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });

  expect(
    screen.getAllByText(/Details cannot exceed 256 characters./i).length,
  ).toBeGreaterThanOrEqual(1);
});

it(`sets requestingApcCoverage to 'Already submitted' by default`, async () => {
  const onSave = jest.fn();
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        title="manuscript title"
        type="Original Research"
        lifecycle="Typeset proof"
        onSave={onSave}
      />
    </StaticRouter>,
  );

  userEvent.click(screen.getByRole('button', { name: /Submit/i }));
  await waitFor(() => {
    expect(onSave).toHaveBeenCalledWith({
      title: 'manuscript title',
      teamId,
      versions: [
        expect.objectContaining({
          type: 'Original Research',
          lifecycle: 'Typeset proof',
          requestingApcCoverage: 'Already submitted',
        }),
      ],
    });
  });
});

describe('preprintDoi', () => {
  it.each([
    { lifecycle: 'Preprint, version 1', status: 'required' },
    { lifecycle: 'Preprint, version 2', status: 'required' },
    { lifecycle: 'Preprint, version 3+', status: 'required' },
    { lifecycle: 'Publication', status: 'optional' },
    {
      lifecycle: 'Publication with addendum or corrigendum',
      status: 'optional',
    },
  ] as { lifecycle: ManuscriptLifecycle; status: string }[])(
    'preprintDoi is $status when lifecycle is $lifecycle',
    async ({ lifecycle, status }) => {
      render(
        <StaticRouter>
          <ManuscriptForm
            {...defaultProps}
            type="Original Research"
            lifecycle={lifecycle}
          />
        </StaticRouter>,
      );

      expect(
        screen.getByRole('textbox', {
          name: new RegExp(`Preprint DOI \\(${status}\\)`, 'i'),
        }),
      ).toBeVisible();
    },
  );
});

describe('renders the necessary fields', () => {
  const fieldInputMapping = {
    preprintDoi: 'Preprint DOI',
    publicationDoi: 'Publication DOI',
    requestingApcCoverage: 'Will you be requesting APC coverage',
    otherDetails: 'Please provide details',
    type: 'Type of Manuscript',
    lifecycle: 'Where is the manuscript in the life cycle?',
  };

  describe.each(Object.keys(manuscriptFormFieldsMapping))(
    'when type is %s',
    (type) => {
      const manuscriptType = type as ManuscriptType;
      it.each(Object.keys(manuscriptFormFieldsMapping[manuscriptType]))(
        'lifecycle is %s',
        (lifecycle) => {
          const manuscriptLifecycle = lifecycle as ManuscriptLifecycle;
          const { getByText } = render(
            <StaticRouter>
              <ManuscriptForm
                {...defaultProps}
                type={manuscriptType}
                lifecycle={manuscriptLifecycle}
              />
            </StaticRouter>,
          );

          manuscriptFormFieldsMapping[manuscriptType][
            manuscriptLifecycle
          ].forEach((field) => {
            expect(getByText(fieldInputMapping[field])).toBeVisible();
          });
        },
      );
    },
  );
});

it('resets form fields to default values when no longer visible', async () => {
  const onSave = jest.fn();
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        title="manuscript title"
        onSave={onSave}
      />
    </StaticRouter>,
  );

  const typeTextbox = screen.getByRole('textbox', {
    name: /Type of Manuscript/i,
  });
  userEvent.type(typeTextbox, 'Original');
  userEvent.type(typeTextbox, specialChars.enter);
  typeTextbox.blur();

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  userEvent.type(lifecycleTextbox, 'Publication');
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  const preprintDoi = '10.4444/test';
  const publicationDoi = '10.4467/test';

  const preprintDoiTextbox = screen.getByRole('textbox', {
    name: /Preprint DOI/i,
  });
  userEvent.type(preprintDoiTextbox, preprintDoi);

  const publicationDoiTextbox = screen.getByRole('textbox', {
    name: /Publication DOI/i,
  });
  userEvent.type(publicationDoiTextbox, publicationDoi);

  expect(preprintDoiTextbox).toHaveValue(preprintDoi);
  expect(publicationDoiTextbox).toHaveValue(publicationDoi);

  userEvent.type(
    lifecycleTextbox,
    'Draft manuscript (prior to preprint submission)',
  );
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  expect(
    screen.queryByRole('textbox', {
      name: /Preprint DOI/i,
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('textbox', {
      name: /Publication DOI/i,
    }),
  ).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /Submit/i }));
  await waitFor(() => {
    expect(onSave).toHaveBeenCalledWith({
      title: 'manuscript title',
      versions: [
        expect.objectContaining({
          preprintDoi: undefined,
          publicationDoi: undefined,
        }),
      ],
      teamId,
    });
  });
});

it('maintains values provided when lifecycle changes but field is still visible', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} title="manuscript title" />
    </StaticRouter>,
  );

  const typeTextbox = screen.getByRole('textbox', {
    name: /Type of Manuscript/i,
  });
  userEvent.type(typeTextbox, 'Original');
  userEvent.type(typeTextbox, specialChars.enter);
  typeTextbox.blur();

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  userEvent.type(lifecycleTextbox, 'Publication');
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  const preprintDoi = '10.4444/test';
  const publicationDoi = '10.4467/test';

  const preprintDoiTextbox = screen.getByRole('textbox', {
    name: /Preprint DOI/i,
  });
  userEvent.type(preprintDoiTextbox, preprintDoi);

  const publicationDoiTextbox = screen.getByRole('textbox', {
    name: /Publication DOI/i,
  });
  userEvent.type(publicationDoiTextbox, publicationDoi);

  expect(preprintDoiTextbox).toHaveValue(preprintDoi);
  expect(publicationDoiTextbox).toHaveValue(publicationDoi);

  userEvent.type(lifecycleTextbox, 'Preprint, version 1');
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  expect(
    screen.getByRole('textbox', {
      name: /Preprint DOI/i,
    }),
  ).toHaveValue(preprintDoi);
  expect(
    screen.queryByRole('textbox', {
      name: /Publication DOI/i,
    }),
  ).not.toBeInTheDocument();
});

it('does not submit when required values are missing', async () => {
  const onSave = jest.fn();
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} onSave={onSave} />
    </StaticRouter>,
  );

  const submitButton = screen.getByRole('button', { name: /Submit/i });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });

  expect(
    screen.getByRole('textbox', { name: /Title of Manuscript/i }),
  ).toBeInvalid();
  expect(onSave).not.toHaveBeenCalled();
});

it('should go back when cancel button is clicked', () => {
  const { getByText } = render(
    <Router history={history}>
      <Route path="/form">
        <ManuscriptForm {...defaultProps} />
      </Route>
    </Router>,
    { wrapper: MemoryRouter },
  );

  history.push('/another-url');
  history.push('/form');

  const cancelButton = getByText(/cancel/i);
  expect(cancelButton).toBeInTheDocument();
  userEvent.click(cancelButton);

  expect(history.location.pathname).toBe('/another-url');
});
