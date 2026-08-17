import {
  researchTagEnvironmentResponse,
  researchTagMethodResponse,
  researchTagOrganismResponse,
} from '@asap-hub/fixtures';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import ResearchOutputExtraInformationCard from '../ResearchOutputExtraInformationCard';
import { renderWithResearchOutputForm } from '../test-utils/research-output-form';

const props: ComponentProps<typeof ResearchOutputExtraInformationCard> = {
  tagSuggestions: [],
  documentType: 'Article',
  researchTags: [],
  showExtraInformationFields: true,
  showCatalogNumber: false,
};

it('should render a tag', async () => {
  renderWithResearchOutputForm(
    <ResearchOutputExtraInformationCard {...props} />,
    { defaultValues: { keywords: ['example'] } },
  );
  expect(screen.getByText(/example/i)).toBeVisible();
});

it('should update form value when a tag is selected', async () => {
  const { methodsRef } = renderWithResearchOutputForm(
    <ResearchOutputExtraInformationCard
      {...props}
      tagSuggestions={[{ label: 'Example', value: 'Example' }]}
    />,
  );
  await userEvent.click(screen.getByLabelText(/keyword/i));
  await userEvent.click(screen.getByText('Example'));
  expect(methodsRef.current?.getValues('keywords')).toEqual(['Example']);
});

it('should update form value when a text is being typed into access instructions', async () => {
  const { methodsRef } = renderWithResearchOutputForm(
    <ResearchOutputExtraInformationCard
      {...props}
      showExtraInformationFields
    />,
    { defaultValues: { usageNotes: 'access-instructions-value' } },
  );

  expect(screen.getByText('access-instructions-value')).toBeVisible();

  const input = screen.getByRole('textbox', { name: /usage notes/i });
  await userEvent.type(input, 't');
  expect(methodsRef.current?.getValues('usageNotes')).toEqual(
    'access-instructions-valuet',
  );
});

it('should show lab catalogue number when showCatalogNumber is true', async () => {
  const { rerender } = renderWithResearchOutputForm(
    <ResearchOutputExtraInformationCard {...props} showCatalogNumber={false} />,
  );
  expect(screen.queryByLabelText(/Catalog Number/i)).toBeNull();

  rerender(
    <ResearchOutputExtraInformationCard
      {...props}
      documentType={'Lab Material'}
      showCatalogNumber
    />,
  );
  expect(screen.queryByLabelText(/Catalog Number/i)).toBeVisible();
});

it('should show the identifier section when showExtraInformationFields is true', async () => {
  const { rerender } = renderWithResearchOutputForm(
    <ResearchOutputExtraInformationCard
      {...props}
      showExtraInformationFields={false}
    />,
  );
  expect(
    screen.queryByRole('combobox', { name: /Identifier Type/i }),
  ).toBeNull();

  expect(screen.queryByRole('textbox', { name: /usage notes/i })).toBeNull();

  rerender(
    <ResearchOutputExtraInformationCard
      {...props}
      showExtraInformationFields
    />,
  );
  expect(
    screen.getByRole('combobox', { name: /Identifier Type/i }),
  ).toBeVisible();
  expect(screen.getByRole('textbox', { name: /usage notes/i })).toBeVisible();
});

it('should hide methods when there is no suggestions', async () => {
  renderWithResearchOutputForm(
    <ResearchOutputExtraInformationCard {...props} />,
  );
  expect(screen.queryByLabelText(/Methods/i)).toBeNull();
});

it('should update form value when a method is selected', async () => {
  const { methodsRef } = renderWithResearchOutputForm(
    <ResearchOutputExtraInformationCard
      {...props}
      researchTags={[researchTagMethodResponse]}
    />,
  );

  expect(await screen.findByLabelText(/method/i)).toBeVisible();

  await userEvent.click(screen.getByLabelText(/method/i));
  await userEvent.click(screen.getByText('ELISA'));
  expect(methodsRef.current?.getValues('methods')).toEqual(['ELISA']);
});

it('should hide organisms when there is no suggestions', async () => {
  renderWithResearchOutputForm(
    <ResearchOutputExtraInformationCard {...props} />,
  );
  expect(screen.queryByLabelText(/Organisms/i)).toBeNull();
});

it('should update form value when an organism is selected', async () => {
  const { methodsRef } = renderWithResearchOutputForm(
    <ResearchOutputExtraInformationCard
      {...props}
      researchTags={[researchTagOrganismResponse]}
    />,
  );

  expect(await screen.findByLabelText(/organisms/i)).toBeVisible();

  await userEvent.click(screen.getByLabelText(/organisms/i));
  await userEvent.click(screen.getByText('Rat'));
  expect(methodsRef.current?.getValues('organisms')).toEqual(['Rat']);
});

it('should hide environments when there is no suggestions', async () => {
  renderWithResearchOutputForm(
    <ResearchOutputExtraInformationCard {...props} />,
  );
  expect(screen.queryByLabelText(/environments/i)).toBeNull();
});

it('should update form value when an environment is selected', async () => {
  const { methodsRef } = renderWithResearchOutputForm(
    <ResearchOutputExtraInformationCard
      {...props}
      researchTags={[researchTagEnvironmentResponse]}
    />,
  );

  expect(await screen.findByLabelText(/environments/i)).toBeVisible();

  await userEvent.click(screen.getByLabelText(/environments/i));
  await userEvent.click(screen.getByText('In Vitro'));
  expect(methodsRef.current?.getValues('environments')).toEqual(['In Vitro']);
});
