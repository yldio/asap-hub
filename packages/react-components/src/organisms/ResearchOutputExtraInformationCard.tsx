import {
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchTagResponse,
} from '@asap-hub/model';
import { ComponentProps } from 'react';
import { Link } from '../atoms';
import { mailToSupport } from '../mail';
import {
  FormCard,
  LabeledMultiSelect,
  LabeledTextArea,
  LabeledTextField,
} from '../molecules';
import { noop } from '../utils';
import {
  ResearchOutputIdentifier,
  ResearchOutputIdentifierProps,
} from './ResearchOutputIdentifier';

type ResearchOutputExtraInformationProps = Pick<
  ResearchOutputPostRequest,
  'usageNotes' | 'labCatalogNumber' | 'methods' | 'organisms' | 'environments'
> & {
  tags: string[];
  tagSuggestions: NonNullable<
    ComponentProps<typeof LabeledMultiSelect>['suggestions']
  >;
  onChangeTags?: (values: string[]) => void;
  onChangeUsageNotes?: (value: string) => void;
  onChangeMethods?: (value: string[]) => void;
  onChangeOrganisms?: (value: string[]) => void;
  onChangeEnvironments?: (value: string[]) => void;
  onChangeLabCatalogNumber?: (value: string) => void;
  isSaving: boolean;
  researchTags: ResearchTagResponse[];
} & Omit<ResearchOutputIdentifierProps, 'required'>;

const ResearchOutputExtraInformationCard: React.FC<
  ResearchOutputExtraInformationProps
> = ({
  onChangeTags = noop,
  tags,
  tagSuggestions,
  onChangeUsageNotes = noop,
  usageNotes,
  isSaving,
  identifier = '',
  identifierType = ResearchOutputIdentifierType.None,
  setIdentifier = noop,
  setIdentifierType = noop,
  documentType,
  labCatalogNumber,
  onChangeLabCatalogNumber,
  methods,
  onChangeMethods = noop,
  organisms,
  onChangeOrganisms = noop,
  environments,
  onChangeEnvironments = noop,
  researchTags,
}) => {
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
        <LabeledMultiSelect
          title="Methods"
          subtitle="(optional)"
          description="Select the methods that were used in this output."
          values={methods.map((method) => ({
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
            onChangeMethods(options.map(({ value }) => value))
          }
        />
      )}
      {organismSuggestions.length > 0 && (
        <LabeledMultiSelect
          title="Organisms"
          subtitle="(optional)"
          description="Select the organisms that were used in this output."
          values={organisms.map((organism) => ({
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
            onChangeOrganisms(options.map(({ value }) => value))
          }
        />
      )}
      {environmentSuggestions.length > 0 && (
        <LabeledMultiSelect
          title="Environments"
          subtitle="(optional)"
          description="Select the environments that were used in this output."
          values={environments.map((environment) => ({
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
            onChangeEnvironments(options.map(({ value }) => value))
          }
        />
      )}

      <LabeledMultiSelect
        title="Additional Tags"
        description="Increase the discoverability of this output by adding keywords."
        subtitle="(optional)"
        values={tags.map((tag) => ({ label: tag, value: tag }))}
        enabled={!isSaving}
        suggestions={tagSuggestions}
        placeholder="Start typing... (E.g. Cell Biology)"
        onChange={(options) => onChangeTags(options.map(({ value }) => value))}
      />

      <Link href={mailToSupport({ subject: 'New keyword' }).toString()}>
        Ask ASAP to add a new keyword
      </Link>
      {documentType !== 'Report' && (
        <>
          <ResearchOutputIdentifier
            documentType={documentType}
            identifier={identifier}
            setIdentifier={setIdentifier}
            identifierType={identifierType}
            setIdentifierType={setIdentifierType}
          />
          {documentType === 'Lab Material' && (
            <LabeledTextField
              title="Catalog Number (Vendor/Lab)"
              subtitle="(optional)"
              description="Catalog number and vendor used to identify resource"
              onChange={onChangeLabCatalogNumber}
              placeholder="Catalog number and vendor e.g. AB123 (Abcam)"
              enabled={!isSaving}
              value={labCatalogNumber || ''}
            />
          )}
          <LabeledTextArea
            title="Usage Notes"
            subtitle="(optional)"
            onChange={onChangeUsageNotes}
            placeholder="E.g. To access the output, you will first need to create an account on..."
            enabled={!isSaving}
            value={usageNotes || ''}
          />
        </>
      )}
    </FormCard>
  );
};

export default ResearchOutputExtraInformationCard;
