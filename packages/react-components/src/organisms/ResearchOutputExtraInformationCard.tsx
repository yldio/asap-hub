import {
  ResearchOutputDocumentType,
  ResearchTagResponse,
} from '@asap-hub/model';
import { ResearchOutputAvailableActions } from '@asap-hub/react-context';
import { ComponentProps } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Link } from '../atoms';
import { mailToSupport } from '../mail';
import {
  FormCard,
  LabeledMultiSelect,
  LabeledTextArea,
  LabeledTextField,
} from '../molecules';
import { rem } from '../pixels';
import { ResearchOutputFormValues } from '../utils';
import { ResearchOutputIdentifier } from './ResearchOutputIdentifier';

type ResearchOutputExtraInformationProps = Pick<
  ResearchOutputAvailableActions,
  'showExtraInformationFields' | 'showCatalogNumber'
> & {
  tagSuggestions: NonNullable<
    ComponentProps<typeof LabeledMultiSelect>['suggestions']
  >;
  researchTags: ResearchTagResponse[];
  documentType: ResearchOutputDocumentType;
  isSaving?: boolean;
};

const ResearchOutputExtraInformationCard: React.FC<
  ResearchOutputExtraInformationProps
> = ({
  tagSuggestions,
  documentType,
  researchTags,
  showExtraInformationFields,
  showCatalogNumber,
  isSaving = false,
}) => {
  const { control } = useFormContext<ResearchOutputFormValues>();

  const filterByCategory = (name: string) => (tag: ResearchTagResponse) =>
    tag.category === name;

  const methodSuggestions = researchTags.filter(filterByCategory('Method'));
  const organismSuggestions = researchTags.filter(filterByCategory('Organism'));
  const environmentSuggestions = researchTags.filter(
    filterByCategory('Environment'),
  );

  return (
    <FormCard title="What extra information can you provide?">
      {methodSuggestions.length > 0 && (
        <Controller
          name="methods"
          control={control}
          render={({ field: { value, onChange } }) => (
            <LabeledMultiSelect
              title="Methods"
              subtitle="(optional)"
              description="Select the methods that were used in this output."
              values={value.map((method) => ({
                label: method,
                value: method,
              }))}
              suggestions={methodSuggestions.map((method) => ({
                label: method.name,
                value: method.name,
              }))}
              placeholder="Add a method (E.g. Activity Assay)"
              enabled={!isSaving}
              onChange={(options) =>
                onChange(options.map(({ value: optionValue }) => optionValue))
              }
            />
          )}
        />
      )}
      {organismSuggestions.length > 0 && (
        <Controller
          name="organisms"
          control={control}
          render={({ field: { value, onChange } }) => (
            <LabeledMultiSelect
              title="Organisms"
              subtitle="(optional)"
              description="Select the organisms that were used in this output."
              values={value.map((organism) => ({
                label: organism,
                value: organism,
              }))}
              suggestions={organismSuggestions.map((organism) => ({
                label: organism.name,
                value: organism.name,
              }))}
              placeholder="Add an organism (E.g. Mouse)"
              enabled={!isSaving}
              onChange={(options) =>
                onChange(options.map(({ value: optionValue }) => optionValue))
              }
            />
          )}
        />
      )}
      {environmentSuggestions.length > 0 && (
        <Controller
          name="environments"
          control={control}
          render={({ field: { value, onChange } }) => (
            <LabeledMultiSelect
              title="Environments"
              subtitle="(optional)"
              description="Select the environments that were used in this output."
              values={value.map((environment) => ({
                label: environment,
                value: environment,
              }))}
              suggestions={environmentSuggestions.map((environment) => ({
                label: environment.name,
                value: environment.name,
              }))}
              placeholder="Add an environment (E.g. In Vivo)"
              enabled={!isSaving}
              onChange={(options) =>
                onChange(options.map(({ value: optionValue }) => optionValue))
              }
            />
          )}
        />
      )}
      <div style={{ display: 'flex', flexFlow: 'column', gap: rem(16) }}>
        <Controller
          name="keywords"
          control={control}
          render={({ field: { value, onChange } }) => (
            <LabeledMultiSelect
              title="Additional Tags"
              description="Increase the discoverability of this output by adding keywords."
              subtitle="(optional)"
              values={value.map((tag) => ({ label: tag, value: tag }))}
              enabled={!isSaving}
              suggestions={tagSuggestions}
              placeholder="Start typing... (E.g. Cell Biology)"
              onChange={(options) =>
                onChange(options.map(({ value: optionValue }) => optionValue))
              }
            />
          )}
        />

        <Link href={mailToSupport({ subject: 'New keyword' }).toString()}>
          Ask ASAP to add a new keyword
        </Link>
      </div>
      {showExtraInformationFields && (
        <>
          <ResearchOutputIdentifier documentType={documentType} />

          {showCatalogNumber && (
            <Controller
              name="labCatalogNumber"
              control={control}
              render={({ field: { value, onChange } }) => (
                <LabeledTextField
                  title="Catalog Number (Vendor/Lab)"
                  subtitle="(optional)"
                  description="Catalog number and vendor used to identify resource"
                  onChange={onChange}
                  placeholder="Catalog number and vendor e.g. AB123 (Abcam)"
                  enabled={!isSaving}
                  value={value || ''}
                />
              )}
            />
          )}

          <Controller
            name="usageNotes"
            control={control}
            render={({ field: { value, onChange } }) => (
              <LabeledTextArea
                title="Usage Notes"
                subtitle="(optional)"
                onChange={onChange}
                placeholder="E.g. To access the output, you will first need to create an account on..."
                enabled={!isSaving}
                value={value || ''}
              />
            )}
          />
        </>
      )}
    </FormCard>
  );
};

export default ResearchOutputExtraInformationCard;
