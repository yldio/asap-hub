import { MarkdownEditor as ContentfulMarkdownEditor } from '@contentful/field-editor-markdown';

type MarkdownEditorProps = {
  value: string;
  onValueChanged: (val: string) => void;
};

const MarkdownEditor = ({ value, onValueChanged }: MarkdownEditorProps) => {
  const sdk = {
    locales: {
      direction: [],
    },
    access: {
      can: () => ({
        then: (fn: () => void) => fn(),
      }),
    },
    field: {
      dialogs: {},
      getValue: () => value,
      onSchemaErrorsChanged: () => null,
      onIsDisabledChanged: () => null,
      onValueChanged,
    },
  };
  return <ContentfulMarkdownEditor isInitiallyDisabled={false} sdk={sdk} />;
};

export default MarkdownEditor;
