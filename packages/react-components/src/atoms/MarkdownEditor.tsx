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
      can: () => {
        return { then: (fn: () => void) => fn() };
      },
    },
    field: {
      dialogs: {},
      getValue: () => {
        return value;
      },
      onSchemaErrorsChanged: () => null,
      onIsDisabledChanged: () => null,
      onValueChanged: onValueChanged,
    },
  };
  return <ContentfulMarkdownEditor isInitiallyDisabled={false} sdk={sdk} />;
};

export default MarkdownEditor;
