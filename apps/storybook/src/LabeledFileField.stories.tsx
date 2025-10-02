import { LabeledFileField } from '@asap-hub/react-components';

import { text, boolean, number } from './knobs';

export default {
  title: 'Molecules / Labeled File Field',
  component: LabeledFileField,
};

const mockUpload = async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Uploaded:', file.name);
};

export const Normal = () => (
  <LabeledFileField
    title={text('Title', 'Upload Document')}
    subtitle={text('Subtitle', '(Required)')}
    description={text('Description', 'PDF or Word documents only')}
    hint={text('Hint', 'Maximum file size: 10MB')}
    enabled={boolean('Enabled', true)}
    handleFileUpload={mockUpload}
    accept={text('Accept', '.pdf,.doc,.docx')}
  />
);

export const WithFile = () => (
  <LabeledFileField
    title="Upload Document"
    subtitle="(Required)"
    handleFileUpload={mockUpload}
    currentFiles={[{ id: '1', url: '/file.pdf', filename: 'document.pdf' }]}
    onRemove={(id) => console.log('Remove file:', id)}
  />
);

export const MultipleFiles = () => (
  <LabeledFileField
    title="Upload Documents"
    subtitle="(Optional)"
    description="You can upload up to 3 files"
    handleFileUpload={mockUpload}
    maxFiles={number('Max Files', 3)}
    currentFiles={[
      { id: '1', url: '/file1.pdf', filename: 'document1.pdf' },
      { id: '2', url: '/file2.pdf', filename: 'document2.pdf' },
    ]}
    onRemove={(id) => console.log('Remove file:', id)}
  />
);

export const Disabled = () => (
  <LabeledFileField
    title="Upload Document"
    subtitle="(Required)"
    handleFileUpload={mockUpload}
    enabled={false}
  />
);

export const WithValidationError = () => (
  <LabeledFileField
    title="Upload Document"
    subtitle="(Required)"
    handleFileUpload={mockUpload}
    customValidationMessage="File type not supported. Please upload a PDF."
  />
);

export const MaxFilesReached = () => (
  <LabeledFileField
    title="Upload Documents"
    subtitle="(Required)"
    description="Maximum 2 files allowed"
    handleFileUpload={mockUpload}
    maxFiles={2}
    currentFiles={[
      { id: '1', url: '/file1.pdf', filename: 'document1.pdf' },
      { id: '2', url: '/file2.pdf', filename: 'document2.pdf' },
    ]}
    onRemove={(id) => console.log('Remove file:', id)}
  />
);
