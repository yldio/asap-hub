import {
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputDocumentType,
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
  TeamCreateOutputIdentifier,
  TeamCreateOutputIdentifierProps,
} from './TeamCreateOutputIdentifier';

type TeamCreateOutputExtraInformationProps = Pick<
  ResearchOutputPostRequest,
  'tags' | 'accessInstructions' | 'labCatalogNumber'
> & {
  tagSuggestions: NonNullable<
    ComponentProps<typeof LabeledMultiSelect>['suggestions']
  >;
  onChangeTags?: (values: string[]) => void;
  onChangeAccessInstructions?: (value: string) => void;
  onChangeLabCatalogNumber?: (value: string) => void;
  isSaving: boolean;
  documentType: ResearchOutputDocumentType;
  identifierRequired: boolean;
} & Omit<TeamCreateOutputIdentifierProps, 'required'>;

const TeamCreateOutputExtraInformationCard: React.FC<TeamCreateOutputExtraInformationProps> =
  ({
    onChangeTags = noop,
    tags,
    tagSuggestions,
    onChangeAccessInstructions = noop,
    accessInstructions,
    isSaving,
    identifier = '',
    identifierType = ResearchOutputIdentifierType.None,
    setIdentifier = noop,
    setIdentifierType = noop,
    identifierRequired,
    documentType,
    labCatalogNumber,
    onChangeLabCatalogNumber,
  }) => (
    <FormCard title="What extra information can you provide?">
      <LabeledMultiSelect
        title="Additional Keywords"
        description="Increase the discoverability of this output by adding tags."
        subtitle="(optional)"
        values={tags.map((tag) => ({ label: tag, value: tag }))}
        enabled={!isSaving}
        suggestions={tagSuggestions}
        placeholder="Add a keyword (E.g. Cell Biology)"
        onChange={(options) => onChangeTags(options.map(({ value }) => value))}
      />

      <Link href={mailToSupport({ subject: 'New keyword' }).toString()}>
        Ask ASAP to add a new keyword
      </Link>

      <TeamCreateOutputIdentifier
        documentType={documentType}
        identifier={identifier}
        setIdentifier={setIdentifier}
        identifierType={identifierType}
        setIdentifierType={setIdentifierType}
        required={identifierRequired}
      />
      {documentType === 'Lab Resource' && (
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
        title="Access instructions"
        subtitle="(optional)"
        onChange={onChangeAccessInstructions}
        placeholder="E.g. To access the output, you will first need to create an account on..."
        enabled={!isSaving}
        value={accessInstructions || ''}
      />
    </FormCard>
  );

export default TeamCreateOutputExtraInformationCard;
