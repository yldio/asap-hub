import {
  FormSection,
  LabeledTextField,
  Link,
  crossIcon,
} from '@asap-hub/react-components';

import { text } from './knobs';

export default {
  title: 'Molecules / Form Section',
};

export const Normal = () => (
  <FormSection
    title={text('Title', 'Personal Information')}
    description={text(
      'Description',
      'Please provide your personal details below.',
    )}
  >
    <LabeledTextField title="First Name" value="" onChange={() => {}} />
    <LabeledTextField title="Last Name" value="" onChange={() => {}} />
    <LabeledTextField title="Email" value="" onChange={() => {}} />
  </FormSection>
);

export const WithoutTitle = () => (
  <FormSection>
    <LabeledTextField title="First Name" value="" onChange={() => {}} />
    <LabeledTextField title="Last Name" value="" onChange={() => {}} />
  </FormSection>
);

export const WithoutTitleButWithDescription = () => (
  <FormSection description="Please provide your contact information below.">
    <LabeledTextField title="Email" value="" onChange={() => {}} />
    <LabeledTextField title="Phone" value="" onChange={() => {}} />
  </FormSection>
);

export const WithHeaderDecoratorOnly = () => (
  <FormSection
    headerDecorator={
      <Link small buttonStyle href={'#'}>
        {crossIcon}
      </Link>
    }
  >
    <LabeledTextField title="Setting 1" value="" onChange={() => {}} />
    <LabeledTextField title="Setting 2" value="" onChange={() => {}} />
  </FormSection>
);

export const WithTitleAndHeaderDecorator = () => (
  <FormSection
    title={text('Title', 'Account Settings')}
    headerDecorator={
      <Link small buttonStyle href={'#'}>
        {crossIcon}
      </Link>
    }
  >
    <LabeledTextField title="Username" value="" onChange={() => {}} />
    <LabeledTextField title="Display Name" value="" onChange={() => {}} />
  </FormSection>
);

export const WithHeaderDecorator = () => (
  <FormSection
    title={text('Title', 'Account Settings')}
    description="Configure your account preferences."
    headerDecorator={
      <Link small buttonStyle href={'#'}>
        {crossIcon}
      </Link>
    }
  >
    <LabeledTextField title="Username" value="" onChange={() => {}} />
    <LabeledTextField title="Display Name" value="" onChange={() => {}} />
  </FormSection>
);
