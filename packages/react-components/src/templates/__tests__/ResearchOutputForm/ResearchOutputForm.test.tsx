import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  researchOutputDocumentTypeToType,
  ResearchOutputIdentifierType,
  ResearchOutputType,
} from '@asap-hub/model';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom/server';
import { createIdentifierField } from '../../../utils/research-output-form';
import ResearchOutputForm from '../../ResearchOutputForm';
import { defaultProps } from '../../test-utils/research-output-form';

jest.setTimeout(60000);

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
});

it('sets authors to required', () => {
  render(
    <StaticRouter location="/">
      <ResearchOutputForm {...defaultProps} authorsRequired={false} />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('textbox', { name: 'Authors (optional)' }),
  ).toBeVisible();
  render(
    <StaticRouter location="/">
      <ResearchOutputForm {...defaultProps} authorsRequired={true} />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('textbox', { name: 'Authors (required)' }),
  ).toBeVisible();
});

describe('createIdentifierField', () => {
  it('maps the ResearchOutputIdentifierType to fields including the identifier', () => {
    expect(
      createIdentifierField(ResearchOutputIdentifierType.Empty, 'identifier'),
    ).toEqual({});
    expect(
      createIdentifierField(ResearchOutputIdentifierType.RRID, 'identifier'),
    ).toEqual({ rrid: 'identifier' });
    expect(
      createIdentifierField(ResearchOutputIdentifierType.DOI, 'identifier'),
    ).toEqual({ doi: 'identifier' });
    expect(
      createIdentifierField(
        ResearchOutputIdentifierType.AccessionNumber,
        'identifier',
      ),
    ).toEqual({ accession: 'identifier' });
  });
});

it('renders the form', async () => {
  render(
    <StaticRouter location="/">
      <ResearchOutputForm {...defaultProps} />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('heading', { name: /What are you sharing/i }),
  ).toBeVisible();
  expect(screen.getByRole('button', { name: /Publish/i })).toBeVisible();
});

it('renders the edit form button when research output data is present', async () => {
  jest.spyOn(console, 'error').mockImplementation();
  render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        researchOutputData={createResearchOutputResponse()}
      />
    </StaticRouter>,
  );

  expect(screen.getByRole('button', { name: /Save/i })).toBeVisible();
});

it('pre populates the form with provided backend response', async () => {
  jest.spyOn(console, 'error').mockImplementation();

  const researchOutputData = {
    ...createResearchOutputResponse(),
    title: 'test title',
    link: 'https://test.com',
    descriptionMD: 'test description',
    shortDescription: 'short description',
    type: 'Genetic Data - DNA' as ResearchOutputType,
    keywords: ['testAddedTag'],
    labs: [
      {
        id: 'lab1',
        name: 'Lab 1',
      },
    ],
  };
  await render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        documentType={'Dataset'}
        typeOptions={Array.from(researchOutputDocumentTypeToType.Dataset)}
        researchOutputData={researchOutputData}
      />
    </StaticRouter>,
  );

  expect(screen.getByTestId('editor')).toBeVisible();
  expect(screen.getByText(researchOutputData.shortDescription)).toBeVisible();
  expect(screen.getByDisplayValue(researchOutputData.title)).toBeVisible();
  expect(screen.getByText(researchOutputData.type!)).toBeVisible();
  expect(screen.getByText(researchOutputData.sharingStatus)).toBeVisible();
  expect(
    screen.getByText(researchOutputData.authors[0]!.displayName),
  ).toBeVisible();

  expect(screen.getByText(researchOutputData.keywords[0]!)).toBeVisible();
  expect(screen.getByText(researchOutputData.labs[0]!.name)).toBeVisible();

  expect(screen.getByRole('button', { name: /Save/i })).toBeVisible();
});

it('pre populates the form with markdown value of usageNotes if it is defined', async () => {
  jest.spyOn(console, 'error').mockImplementation();

  const researchOutputData = {
    ...createResearchOutputResponse(),
    usageNotes: 'rich text',
    usageNotesMD: 'markdown',
  };
  await render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        documentType={'Dataset'}
        typeOptions={Array.from(researchOutputDocumentTypeToType.Dataset)}
        researchOutputData={researchOutputData}
      />
    </StaticRouter>,
  );

  expect(screen.queryByText('rich text')).not.toBeInTheDocument();
  expect(screen.getByText('markdown')).toBeVisible();
});

it('displays keywords suggestions', async () => {
  await render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        tagSuggestions={['2D Cultures', 'Adenosine', 'Adrenal']}
      />
    </StaticRouter>,
  );
  userEvent.click(
    screen.getByText(/Start typing\.\.\. \(E\.g\. Cell Biology\)/i),
  );
  expect(screen.getByText('2D Cultures')).toBeVisible();
  expect(screen.getByText('Adenosine')).toBeVisible();
  expect(screen.getByText('Adrenal')).toBeVisible();
});

it('displays selected teams', async () => {
  await render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        selectedTeams={[{ label: 'Team 1', value: 'abc123' }]}
      />
    </StaticRouter>,
  );
  expect(screen.getByText('Team 1')).toBeVisible();
});

it('displays error message when no author is found', async () => {
  const getAuthorSuggestions = jest.fn().mockResolvedValue([]);
  await render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </StaticRouter>,
  );

  userEvent.click(screen.getByRole('textbox', { name: /Authors/i }));
  expect(screen.getByText(/Sorry, no authors match/i)).toBeVisible();
});

it('displays error message when no lab is found', async () => {
  const getLabSuggestions = jest.fn().mockResolvedValue([]);
  await render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        getLabSuggestions={getLabSuggestions}
      />
    </StaticRouter>,
  );
  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  expect(screen.getByText(/Sorry, no labs match/i)).toBeVisible();
});

it('displays error message when no related research is found', async () => {
  const getRelatedResearchSuggestions = jest.fn().mockResolvedValue([]);
  await render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        getRelatedResearchSuggestions={getRelatedResearchSuggestions}
      />
    </StaticRouter>,
  );
  userEvent.click(screen.getByRole('textbox', { name: /Related Outputs/i }));
  expect(screen.getByText(/Sorry, no related outputs match/i)).toBeVisible();
});

it('displays current team within the form', async () => {
  render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        selectedTeams={[{ label: 'example team', value: 'id' }]}
      />
    </StaticRouter>,
  );
  expect(screen.getByText('example team')).toBeVisible();
});

it('can generate short description when description is present', async () => {
  const getShortDescriptionFromDescription = jest
    .fn()
    .mockResolvedValue('An interesting article');
  const researchOutputData = {
    ...createResearchOutputResponse(),
    shortDescription: '',
  };
  render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        researchOutputData={researchOutputData}
        getShortDescriptionFromDescription={getShortDescriptionFromDescription}
      />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('textbox', { name: /short description/i }),
  ).toHaveValue('');

  userEvent.click(screen.getByRole('button', { name: /Generate/i }));

  await waitFor(() => {
    expect(
      screen.getByRole('textbox', { name: /short description/i }),
    ).toHaveValue('An interesting article');
  });
});
