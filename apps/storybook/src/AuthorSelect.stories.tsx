import { CSSProperties, useState } from 'react';
import { AuthorSelect, AuthorOption } from '@asap-hub/react-components';

import { boolean, number, text } from './knobs';

export default {
  title: 'Organisms / Author Select',
  component: AuthorSelect,
};

// Mock Data: Internal Authors (CRN Hub members with firstName)
const internalAuthorWithAvatar: AuthorOption = {
  value: 'author-1',
  label: 'Alice Wonderland',
  author: {
    id: 'author-1',
    firstName: 'Alice',
    lastName: 'Wonderland',
    displayName: 'Alice Wonderland',
    email: 'alice.wonderland@example.com',
    avatarUrl: 'https://placecats.com/50/50',
  },
};

const internalAuthorNoAvatar: AuthorOption = {
  value: 'author-2',
  label: 'Bob Builder',
  author: {
    id: 'author-2',
    firstName: 'Bob',
    lastName: 'Builder',
    displayName: 'Bob Builder',
    email: 'bob.builder@example.com',
  },
};

const internalAuthor3: AuthorOption = {
  value: 'author-3',
  label: 'Charlie Chaplin',
  author: {
    id: 'author-3',
    firstName: 'Charlie',
    lastName: 'Chaplin',
    displayName: 'Charlie Chaplin',
    email: 'charlie.chaplin@example.com',
    avatarUrl: 'https://placecats.com/51/51',
  },
};

// Mock Data: External Authors (Non-CRN, no firstName)
const externalAuthor: AuthorOption = {
  value: 'external-1',
  label: 'Diana Prince',
  author: {
    id: 'external-1',
    displayName: 'Diana Prince',
    email: 'diana.prince@external.com',
  },
};

const externalAuthor2: AuthorOption = {
  value: 'external-2',
  label: 'Edward Elric',
  author: {
    id: 'external-2',
    displayName: 'Edward Elric',
  },
};

// All authors combined for suggestions
const allAuthors: AuthorOption[] = [
  internalAuthorWithAvatar,
  internalAuthorNoAvatar,
  internalAuthor3,
  externalAuthor,
  externalAuthor2,
];

// Async load function mock
const loadAuthorsMock =
  (authors: AuthorOption[], delay = 500) =>
  (inputValue: string): Promise<AuthorOption[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          authors.filter((a) =>
            a.label.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        );
      }, delay);
    });

// Styling for side-by-side comparisons
const sideBySideStyles: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '2rem',
  alignItems: 'start',
};

const columnStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const labelStyles: CSSProperties = {
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: '#666',
};

// ==========================================
// 1. BASIC DISPLAY MODES (HIGH PRIORITY)
// ==========================================

export const SingleSelectEmpty = () => {
  const [value, setValue] = useState<AuthorOption | null>(null);
  return (
    <AuthorSelect
      title={text('Title', 'Corresponding Author')}
      subtitle={text('Subtitle', '(Required)')}
      description={text('Description', 'Select the corresponding author.')}
      isMulti={false}
      suggestions={allAuthors}
      values={value}
      onChange={(newValue: AuthorOption | null) => setValue(newValue)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const SingleSelectWithInternalAuthor = () => {
  const [value, setValue] = useState<AuthorOption | null>(
    internalAuthorWithAvatar,
  );
  return (
    <AuthorSelect
      title={text('Title', 'Corresponding Author')}
      subtitle={text('Subtitle', '(Required)')}
      description={text(
        'Description',
        'This story demonstrates single-select with an internal author. The chip should NOT span full width.',
      )}
      isMulti={false}
      suggestions={allAuthors}
      values={value}
      onChange={(newValue: AuthorOption | null) => setValue(newValue)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const SingleSelectWithExternalAuthor = () => {
  const [value, setValue] = useState<AuthorOption | null>(externalAuthor);
  return (
    <AuthorSelect
      title={text('Title', 'Corresponding Author')}
      subtitle={text('Subtitle', '')}
      description={text(
        'Description',
        'External authors display with "(Non CRN)" suffix and placeholder icon.',
      )}
      isMulti={false}
      suggestions={allAuthors}
      values={value}
      onChange={(newValue: AuthorOption | null) => setValue(newValue)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const MultiSelectEmpty = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([]);
  return (
    <AuthorSelect
      title={text('Title', 'Authors')}
      subtitle={text('Subtitle', '(Required)')}
      description={text('Description', 'Add all authors of this output.')}
      isMulti
      suggestions={allAuthors}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const MultiSelectWithAuthors = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([
    internalAuthorWithAvatar,
    internalAuthorNoAvatar,
    internalAuthor3,
  ]);
  return (
    <AuthorSelect
      title={text('Title', 'Authors')}
      subtitle={text('Subtitle', '')}
      description={text('Description', 'Multiple internal authors selected.')}
      isMulti
      suggestions={allAuthors}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const MultiSelectMixedAuthors = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([
    internalAuthorWithAvatar,
    externalAuthor,
    internalAuthorNoAvatar,
  ]);
  return (
    <AuthorSelect
      title={text('Title', 'Authors')}
      subtitle={text('Subtitle', '')}
      description={text(
        'Description',
        'Mix of internal and external authors shows different styling.',
      )}
      isMulti
      suggestions={allAuthors}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

// ==========================================
// 2. AUTHOR TYPE VARIATIONS
// ==========================================

export const InternalAuthorWithAvatar = () => {
  const [value, setValue] = useState<AuthorOption | null>(
    internalAuthorWithAvatar,
  );
  return (
    <AuthorSelect
      title={text('Title', 'Internal Author with Avatar')}
      description={text(
        'Description',
        'Shows the avatar image at 24px when avatarUrl is provided.',
      )}
      isMulti={false}
      suggestions={allAuthors}
      values={value}
      onChange={(newValue: AuthorOption | null) => setValue(newValue)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const InternalAuthorWithInitials = () => {
  const [value, setValue] = useState<AuthorOption | null>(
    internalAuthorNoAvatar,
  );
  return (
    <AuthorSelect
      title={text('Title', 'Internal Author with Initials')}
      description={text(
        'Description',
        'Shows initials (BB) when no avatarUrl is provided.',
      )}
      isMulti={false}
      suggestions={allAuthors}
      values={value}
      onChange={(newValue: AuthorOption | null) => setValue(newValue)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const ExternalAuthorDefaultLabel = () => {
  const [value, setValue] = useState<AuthorOption | null>(externalAuthor);
  return (
    <AuthorSelect
      title={text('Title', 'External Author')}
      description={text(
        'Description',
        'External authors show "(Non CRN)" suffix by default.',
      )}
      isMulti={false}
      suggestions={allAuthors}
      values={value}
      onChange={(newValue: AuthorOption | null) => setValue(newValue)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const ExternalAuthorCustomLabel = () => {
  const [value, setValue] = useState<AuthorOption | null>(externalAuthor);
  return (
    <AuthorSelect
      title={text('Title', 'External Author (GP2)')}
      description={text(
        'Description',
        'Use externalLabel prop to customize suffix for GP2 app.',
      )}
      externalLabel={text('External Label', 'Non GP2')}
      isMulti={false}
      suggestions={allAuthors}
      values={value}
      onChange={(newValue: AuthorOption | null) => setValue(newValue)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

// ==========================================
// 3. VALIDATION STATES
// ==========================================

export const RequiredEmpty = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([]);
  return (
    <AuthorSelect
      title={text('Title', 'Authors')}
      subtitle={text('Subtitle', '(Required)')}
      description={text(
        'Description',
        'Blur the field to see validation error.',
      )}
      isMulti
      required
      suggestions={allAuthors}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const RequiredValid = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([
    internalAuthorWithAvatar,
  ]);
  return (
    <AuthorSelect
      title={text('Title', 'Authors')}
      subtitle={text('Subtitle', '(Required)')}
      description={text('Description', 'Required field with valid selection.')}
      isMulti
      required
      suggestions={allAuthors}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const CustomValidationMessage = () => {
  const [value, setValue] = useState<AuthorOption | null>(null);
  return (
    <AuthorSelect
      title={text('Title', 'Primary Investigator')}
      subtitle={text('Subtitle', '(Required)')}
      description={text(
        'Description',
        'Custom validation message via getValidationMessage prop.',
      )}
      isMulti={false}
      required
      suggestions={allAuthors}
      values={value}
      onChange={(newValue: AuthorOption | null) => setValue(newValue)}
      placeholder={text('Placeholder', 'Select primary investigator...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
      getValidationMessage={() =>
        text('Validation Message', 'A primary investigator is required.')
      }
    />
  );
};

export const NoDefaultValidation = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([]);
  return (
    <AuthorSelect
      title={text('Title', 'Optional Authors')}
      subtitle={text('Subtitle', '(Optional)')}
      description={text(
        'Description',
        'useDefaultErrorMessage=false disables the default "Please select at least one author" message.',
      )}
      isMulti
      required
      useDefaultErrorMessage={false}
      suggestions={allAuthors}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

// ==========================================
// 4. DATA LOADING
// ==========================================

export const StaticSuggestions = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([]);
  return (
    <AuthorSelect
      title={text('Title', 'Authors')}
      description={text(
        'Description',
        'All options load immediately from suggestions prop.',
      )}
      isMulti
      suggestions={allAuthors}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const AsyncLoading = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([]);
  return (
    <AuthorSelect
      title={text('Title', 'Authors')}
      description={text(
        'Description',
        'Type to search. Options load asynchronously with a delay.',
      )}
      isMulti
      creatable={false}
      loadOptions={loadAuthorsMock(allAuthors, number('API Delay (ms)', 1000))}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Type to search authors...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const AsyncCreatable = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([]);
  return (
    <AuthorSelect
      title={text('Title', 'Authors')}
      description={text(
        'Description',
        'Type to search or create new external authors.',
      )}
      isMulti
      creatable={boolean('Creatable', true)}
      loadOptions={loadAuthorsMock(allAuthors, number('API Delay (ms)', 500))}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Type to search or add new...')}
      noOptionsMessage={() =>
        text('No Options Message', 'Type a name to add external author')
      }
    />
  );
};

export const NoOptionsMessage = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([]);
  return (
    <AuthorSelect
      title={text('Title', 'Authors')}
      description={text(
        'Description',
        'Type "xyz" to see the no options message.',
      )}
      isMulti
      creatable={false}
      loadOptions={loadAuthorsMock([], 300)}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() =>
        text(
          'No Options Message',
          'No matching authors found. Contact admin to add new members.',
        )
      }
    />
  );
};

// ==========================================
// 5. INTERACTIVE STATES
// ==========================================

export const Disabled = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([
    internalAuthorWithAvatar,
    externalAuthor,
  ]);
  return (
    <AuthorSelect
      title={text('Title', 'Authors')}
      description={text('Description', 'Field is disabled and not editable.')}
      isMulti
      enabled={false}
      suggestions={allAuthors}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const FixedAuthor = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([
    { ...internalAuthorWithAvatar, isFixed: true },
    internalAuthorNoAvatar,
  ]);
  return (
    <AuthorSelect
      title={text('Title', 'Authors')}
      description={text(
        'Description',
        'Alice is fixed and cannot be removed. Others can be removed.',
      )}
      isMulti
      suggestions={allAuthors}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

export const Creatable = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([]);
  return (
    <AuthorSelect
      title={text('Title', 'Authors')}
      description={text(
        'Description',
        'Type any name to create a new external author.',
      )}
      isMulti
      creatable={boolean('Creatable', true)}
      suggestions={allAuthors}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Start typing...')}
      noOptionsMessage={() => text('No Options Message', 'Type to add author')}
    />
  );
};

export const WithFullDescription = () => {
  const [values, setValues] = useState<readonly AuthorOption[]>([
    internalAuthorWithAvatar,
  ]);
  return (
    <AuthorSelect
      title={text('Title', 'Manuscript Authors')}
      subtitle={text('Subtitle', '(Required)')}
      description={text(
        'Description',
        'Add all authors in the order they should appear on the manuscript. You can drag to reorder. External collaborators will be marked as "Non CRN".',
      )}
      isMulti
      required
      suggestions={allAuthors}
      values={values}
      onChange={(newValues: readonly AuthorOption[]) => setValues(newValues)}
      placeholder={text('Placeholder', 'Search or type to add author...')}
      noOptionsMessage={() => text('No Options Message', 'No authors found')}
    />
  );
};

// ==========================================
// 6. COMPARISON STORIES (Visual Regression)
// ==========================================

export const SideBySideComparison = () => {
  const [singleValue, setSingleValue] = useState<AuthorOption | null>(
    internalAuthorWithAvatar,
  );
  const [multiValues, setMultiValues] = useState<readonly AuthorOption[]>([
    internalAuthorWithAvatar,
  ]);
  return (
    <div style={sideBySideStyles}>
      <div style={columnStyles}>
        <div style={labelStyles}>Single Select (isMulti=false)</div>
        <AuthorSelect
          title="Corresponding Author"
          description="Single author selection with chip styling."
          isMulti={false}
          suggestions={allAuthors}
          values={singleValue}
          onChange={(newValue: AuthorOption | null) => setSingleValue(newValue)}
          placeholder="Start typing..."
          noOptionsMessage={() => 'No authors found'}
        />
      </div>
      <div style={columnStyles}>
        <div style={labelStyles}>Multi Select (isMulti=true)</div>
        <AuthorSelect
          title="All Authors"
          description="Multiple author selection with chip styling."
          isMulti
          suggestions={allAuthors}
          values={multiValues}
          onChange={(newValues: readonly AuthorOption[]) =>
            setMultiValues(newValues)
          }
          placeholder="Start typing..."
          noOptionsMessage={() => 'No authors found'}
        />
      </div>
    </div>
  );
};
SideBySideComparison.parameters = {
  docs: {
    description: {
      story:
        'Critical comparison: Both single and multi-select should render chips with consistent width that matches content, not full container width.',
    },
  },
};

export const AllEmptyStates = () => {
  const [singleValue, setSingleValue] = useState<AuthorOption | null>(null);
  const [multiValues, setMultiValues] = useState<readonly AuthorOption[]>([]);
  return (
    <div style={sideBySideStyles}>
      <div style={columnStyles}>
        <div style={labelStyles}>Single Select Empty</div>
        <AuthorSelect
          title="Corresponding Author"
          isMulti={false}
          suggestions={allAuthors}
          values={singleValue}
          onChange={(newValue: AuthorOption | null) => setSingleValue(newValue)}
          placeholder="Select one author..."
          noOptionsMessage={() => 'No authors found'}
        />
      </div>
      <div style={columnStyles}>
        <div style={labelStyles}>Multi Select Empty</div>
        <AuthorSelect
          title="All Authors"
          isMulti
          suggestions={allAuthors}
          values={multiValues}
          onChange={(newValues: readonly AuthorOption[]) =>
            setMultiValues(newValues)
          }
          placeholder="Select authors..."
          noOptionsMessage={() => 'No authors found'}
        />
      </div>
    </div>
  );
};
AllEmptyStates.parameters = {
  docs: {
    description: {
      story: 'Empty states should have consistent height between modes.',
    },
  },
};

export const AllFilledStates = () => {
  const [singleInternal, setSingleInternal] = useState<AuthorOption | null>(
    internalAuthorWithAvatar,
  );
  const [singleExternal, setSingleExternal] = useState<AuthorOption | null>(
    externalAuthor,
  );
  const [multiInternal, setMultiInternal] = useState<readonly AuthorOption[]>([
    internalAuthorWithAvatar,
    internalAuthorNoAvatar,
  ]);
  const [multiMixed, setMultiMixed] = useState<readonly AuthorOption[]>([
    internalAuthorWithAvatar,
    externalAuthor,
  ]);
  return (
    <div style={sideBySideStyles}>
      <div style={columnStyles}>
        <div style={labelStyles}>Single Select (Internal)</div>
        <AuthorSelect
          title="Internal Author"
          isMulti={false}
          suggestions={allAuthors}
          values={singleInternal}
          onChange={(newValue: AuthorOption | null) =>
            setSingleInternal(newValue)
          }
          placeholder="Start typing..."
          noOptionsMessage={() => 'No authors found'}
        />
        <div style={labelStyles}>Single Select (External)</div>
        <AuthorSelect
          title="External Author"
          isMulti={false}
          suggestions={allAuthors}
          values={singleExternal}
          onChange={(newValue: AuthorOption | null) =>
            setSingleExternal(newValue)
          }
          placeholder="Start typing..."
          noOptionsMessage={() => 'No authors found'}
        />
      </div>
      <div style={columnStyles}>
        <div style={labelStyles}>Multi Select (Internal)</div>
        <AuthorSelect
          title="Internal Authors"
          isMulti
          suggestions={allAuthors}
          values={multiInternal}
          onChange={(newValues: readonly AuthorOption[]) =>
            setMultiInternal(newValues)
          }
          placeholder="Start typing..."
          noOptionsMessage={() => 'No authors found'}
        />
        <div style={labelStyles}>Multi Select (Mixed)</div>
        <AuthorSelect
          title="Mixed Authors"
          isMulti
          suggestions={allAuthors}
          values={multiMixed}
          onChange={(newValues: readonly AuthorOption[]) =>
            setMultiMixed(newValues)
          }
          placeholder="Start typing..."
          noOptionsMessage={() => 'No authors found'}
        />
      </div>
    </div>
  );
};
AllFilledStates.parameters = {
  docs: {
    description: {
      story:
        'All filled states for visual comparison. Chips should have consistent sizing and not span full width.',
    },
  },
};

export const ChipWidthRegression = () => {
  const [value1, setValue1] = useState<AuthorOption | null>(
    internalAuthorWithAvatar,
  );
  const [value2, setValue2] = useState<AuthorOption | null>(
    internalAuthorWithAvatar,
  );
  return (
    <div style={columnStyles}>
      <div style={labelStyles}>
        Bug Regression Test: Single-select chip width should match content
      </div>
      <div
        style={{
          border: '2px dashed #ccc',
          padding: '1rem',
          width: '600px',
        }}
      >
        <AuthorSelect
          title="Fixed Width Container (600px)"
          description="The chip should NOT expand to fill this container. It should only be as wide as the author name."
          isMulti={false}
          suggestions={allAuthors}
          values={value1}
          onChange={(newValue: AuthorOption | null) => setValue1(newValue)}
          placeholder="Start typing..."
          noOptionsMessage={() => 'No authors found'}
        />
      </div>
      <div
        style={{
          border: '2px dashed #ccc',
          padding: '1rem',
          width: '400px',
        }}
      >
        <AuthorSelect
          title="Narrower Container (400px)"
          description="Chip width should remain the same regardless of container width."
          isMulti={false}
          suggestions={allAuthors}
          values={value2}
          onChange={(newValue: AuthorOption | null) => setValue2(newValue)}
          placeholder="Start typing..."
          noOptionsMessage={() => 'No authors found'}
        />
      </div>
    </div>
  );
};
ChipWidthRegression.parameters = {
  docs: {
    description: {
      story:
        'CRITICAL: This story tests the bug fix for ASAP-1283. The single-select chip should have width: fit-content and NOT expand to fill the container.',
    },
  },
};
