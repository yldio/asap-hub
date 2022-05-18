import {
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputDocumentType,
  ResearchTagResponse,
} from '@asap-hub/model';
import { ComponentProps, useCallback, useEffect, useState } from 'react';
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
  'tags' | 'accessInstructions' | 'labCatalogNumber' | 'methods' | 'organisms'
> & {
  tagSuggestions: NonNullable<
    ComponentProps<typeof LabeledMultiSelect>['suggestions']
  >;
  onChangeTags?: (values: string[]) => void;
  onChangeAccessInstructions?: (value: string) => void;
  onChangeLabCatalogNumber?: (value: string) => void;
  onChangeMethods?: (value: string[]) => void;
  onChangeOrganisms?: (value: string[]) => void;
  isSaving: boolean;
  documentType: ResearchOutputDocumentType;
  identifierRequired: boolean;
  getResearchTags: (type: string) => Promise<ResearchTagResponse[]>;
  type: ResearchOutputPostRequest['type'] | '';
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
    methods,
    onChangeMethods = noop,
    organisms,
    onChangeOrganisms = noop,
    getResearchTags,
    type,
  }) => {
    const [researchTags, setResearchTags] = useState<ResearchTagResponse[]>([]);

    const methodSuggestions = researchTags.filter(
      (tag) => tag.category === 'Method',
    );
    const organismSuggestions = researchTags.filter(
      (tag) => tag.category === 'Organism',
    );

    const fetchResearchTags = useCallback(
      async (typeForResearchTags: ResearchOutputPostRequest['type'] | '') => {
        if (typeForResearchTags === '') {
          setResearchTags([]);
          return;
        }

        const data = await getResearchTags(typeForResearchTags);

        setResearchTags(data);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    useEffect(() => {
      fetchResearchTags(type);
    }, [type, fetchResearchTags]);

    useEffect(() => {
      onChangeMethods([]);
      onChangeOrganisms([]);
    }, [type, onChangeMethods, onChangeOrganisms]);

    return (
      <FormCard title="What extra information can you provide?">
        {methodSuggestions.length > 0 && (
          <LabeledMultiSelect
            title="Methods"
            subtitle="(optional)"
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

        <LabeledMultiSelect
          title="Additional Keywords"
          description="Increase the discoverability of this output by adding tags."
          subtitle="(optional)"
          values={tags.map((tag) => ({ label: tag, value: tag }))}
          enabled={!isSaving}
          suggestions={tagSuggestions}
          placeholder="Add a keyword (E.g. Cell Biology)"
          onChange={(options) =>
            onChangeTags(options.map(({ value }) => value))
          }
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
  };

export default TeamCreateOutputExtraInformationCard;
