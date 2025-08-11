import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import { useRef, useEffect } from 'react';
import { LexicalEditor } from 'lexical';

export const editorRef = { current: null as LexicalEditor | null };

const EditorRefPluginWrapper = () => {
  const localRef = useRef<LexicalEditor | null>(null);

  useEffect(() => {
    editorRef.current = localRef.current;

    return () => {
      editorRef.current = null;
    };
  }, []);

  return <EditorRefPlugin editorRef={localRef} />;
};

export default EditorRefPluginWrapper;
