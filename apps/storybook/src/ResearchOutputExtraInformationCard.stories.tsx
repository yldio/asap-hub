import { researchTagsResponse } from '@asap-hub/fixtures';
import { researchOutputDocumentTypes } from '@asap-hub/model';
import { ResearchOutputExtraInformationCard } from '@asap-hub/react-components';
import { ComponentProps, ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { select } from './knobs';

export default {
  title: 'Organisms / Team Profile / Team Create Output Extra Information Card',
  component: ResearchOutputExtraInformationCard,
};

const tagSuggestions = ['A53T', 'Activity assay'];

const documentType = select('type', researchOutputDocumentTypes, 'Article');

const commonProps: ComponentProps<typeof ResearchOutputExtraInformationCard> = {
  tagSuggestions: tagSuggestions.map((suggestion) => ({
    label: suggestion,
    value: suggestion,
  })),
  researchTags: researchTagsResponse,
  documentType,
  showExtraInformationFields: documentType !== 'Report',
  showCatalogNumber: documentType === 'Lab Material',
};

const FormWrapper = ({
  children,
  keywords = [],
}: {
  children: ReactNode;
  keywords?: string[];
}) => {
  const methods = useForm({
    defaultValues: {
      keywords,
      methods: [],
      organisms: [],
      environments: [],
      usageNotes: '',
      labCatalogNumber: '',
      identifier: '',
      identifierType: undefined,
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

export const Normal = () => (
  <FormWrapper>
    <ResearchOutputExtraInformationCard {...commonProps} />
  </FormWrapper>
);
export const Filled = () => (
  <FormWrapper keywords={tagSuggestions}>
    <ResearchOutputExtraInformationCard {...commonProps} />
  </FormWrapper>
);
