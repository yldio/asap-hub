import { useCallback, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListNode, ListItemNode } from '@lexical/list';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { HeadingNode } from '@lexical/rich-text';
import { EditorState } from 'lexical';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import ToolbarPlugin from './TextEditorToolbar';
import { useValidation } from '../form';
import { ember } from '../colors';
import { perRem } from '../pixels';

const theme = {
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
    h6: 'editor-heading-h6',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listItem',
  },
  link: 'editor-link',
  text: {
    bold: 'editor-textBold',
    italic: 'editor-textItalic',
    strikethrough: 'editor-textStrikethrough',
    underline: 'editor-textUnderline',
    underlineStrikethrough: 'editor-textUnderlineStrikethrough',
  },
};

const containerStyles = css({
  margin: '20px auto 20px auto',
  borderRadius: '2px',
  width: '100%',
  color: '#000',
  position: 'relative',
  lineHeight: '20px',
  fontWeight: 400,
  textAlign: 'left',
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',

  // editor styles
  '& .editor-link': {
    color: 'rgb(33, 111, 219)',
    textDecoration: 'none',
  },

  '& .editor-paragraph': {
    margin: 0,
    marginBottom: '8px',
    position: 'relative',
    '&:last-child': {
      marginBottom: 0,
    },
  },

  '& .editor-list-ol': {
    padding: 0,
    margin: 0,
    marginLeft: '16px',
  },

  '& .editor-list-ul': {
    padding: 0,
    margin: 0,
    marginLeft: '16px',
  },

  '& .editor-listitem': {
    margin: '8px 32px 8px 32px',
  },

  '& .editor-nested-listitem': {
    listStyleType: 'none',
  },

  '& .editor-textBold': {
    fontStyle: 'bold',
  },
  '& .editor-textItalic': {
    fontStyle: 'italic',
  },
  '& .editor-textStrikethrough': {
    textDecoration: 'line-through',
  },
  '& .editor-textUnderline': {
    textDecoration: 'underline',
  },
  '& .editor-textUnderlineStrikethrough': {
    textDecoration: 'underline line-through',
  },
  '& .editor-heading-h1': {
    fontSize: '24px',
    color: 'rgb(5, 5, 5)',
    fontWeight: 400,
    margin: 0,
    marginBottom: '12px',
    padding: 0,
  },
});

const innerStyles = css({
  background: '#fff',
  position: 'relative',
});
const inputStyles = css({
  minHeight: '150px',
  resize: 'none',
  fontSize: '15px',
  caretColor: 'rgb(5, 5, 5)',
  position: 'relative',
  tabSize: 1,
  outline: 0,
  padding: '15px 10px',
});

const placeholderStyles = css({
  color: '#999',
  overflow: 'hidden',
  position: 'absolute',
  textOverflow: 'ellipsis',
  top: '15px',
  left: '10px',
  fontSize: '15px',
  userSelect: 'none',
  display: 'inline-block',
  pointerEvents: 'none',
});

const validationMessageStyles = css({
  ':empty': {
    display: 'none',
  },
  whiteSpace: 'pre-wrap',

  paddingTop: `${6 / perRem}em`,
  paddingBottom: `${6 / perRem}em`,

  color: ember.rgb,
  borderColor: ember.rgb,
});

const onChangeHandler = (
  editorState: EditorState,
  onChange: (content: string) => void,
) => editorState.read(() => onChange($convertToMarkdownString(TRANSFORMERS)));

export type TextEditorProps = {
  readonly customValidationMessage?: string;
  readonly getValidationMessage?: Parameters<typeof useValidation>[1];
  readonly id?: string;
  readonly required?: boolean;
  readonly value: string;
  onChange: (content: string) => void;
};
const TextEditor = ({
  customValidationMessage = '',
  getValidationMessage,
  value,
  onChange,
  required = false,
}: TextEditorProps) => {
  const { validationMessage, validationTargetProps, validate } =
    useValidation<HTMLInputElement>(
      customValidationMessage,
      getValidationMessage,
    );

  const initialRender = useRef(false);
  const checkValidation = useCallback(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      validate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (required === false) {
      checkValidation();
    }
  }, [required, checkValidation]);

  useEffect(() => {
    checkValidation();
  }, [value, checkValidation]);

  const initialConfig = {
    editorState: () => {
      $convertFromMarkdownString(value, TRANSFORMERS);
    },
    namespace: 'Editor',
    nodes: [AutoLinkNode, LinkNode, ListNode, ListItemNode, HeadingNode],
    theme,
    // eslint-disable-next-line no-console
    onError: console.error,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div css={containerStyles}>
        <ToolbarPlugin />
        <OnChangePlugin
          onChange={(editorState) => onChangeHandler(editorState, onChange)}
        />

        <div css={innerStyles}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                css={inputStyles}
                {...validationTargetProps}
                onBlur={() => {
                  validate();
                }}
              />
            }
            placeholder={<div css={placeholderStyles}>Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <input css={css({ display: 'none' })} value={value} />
          <ListPlugin />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
      <div css={validationMessageStyles}>{validationMessage}</div>
    </LexicalComposer>
  );
};

export default TextEditor;
