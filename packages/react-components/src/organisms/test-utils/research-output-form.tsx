/* istanbul ignore file */
import { ResearchOutputIdentifierType } from '@asap-hub/model';
import { ReactElement, ReactNode } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, RenderOptions } from '@testing-library/react';
import { ResearchOutputFormValues } from '../../utils';

export const emptyResearchOutputFormValues: ResearchOutputFormValues = {
  identifierType: ResearchOutputIdentifierType.Empty,
  identifier: '',
  link: '',
  descriptionMD: '',
  shortDescription: '',
  changelog: '',
  title: '',
  type: '',
  authors: [],
  labs: [],
  teams: [],
  relatedResearch: [],
  usageNotes: '',
  asapFunded: 'Not Sure',
  usedInPublication: 'Not Sure',
  sharingStatus: 'Network Only',
  publishDate: undefined,
  labCatalogNumber: '',
  methods: [],
  organisms: [],
  environments: [],
  subtype: undefined,
  keywords: [],
  relatedEvents: [],
  impact: { value: '', label: '' },
  layImpactStatement: '',
  categories: [],
};

type RenderWithFormOptions = Omit<RenderOptions, 'wrapper'> & {
  defaultValues?: Partial<ResearchOutputFormValues>;
};

export const renderWithResearchOutputForm = (
  ui: ReactElement,
  { defaultValues, ...options }: RenderWithFormOptions = {},
) => {
  const methodsRef: {
    current: UseFormReturn<ResearchOutputFormValues> | null;
  } = { current: null };

  const Wrapper = ({ children }: { children: ReactNode }) => {
    const methods = useForm<ResearchOutputFormValues>({
      mode: 'all',
      defaultValues: {
        ...emptyResearchOutputFormValues,
        ...defaultValues,
      },
    });
    methodsRef.current = methods;
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    methodsRef,
  };
};
