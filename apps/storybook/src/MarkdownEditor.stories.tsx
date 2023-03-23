import { MarkdownEditor } from '@asap-hub/react-components';
import { useState } from 'react';

export default {
  title: 'Atom / Markdown Editor',
  component: MarkdownEditor,
};

export const Normal = () => {
  const [val, setVal] = useState<string>('some text here');
  return <MarkdownEditor value={val} onValueChanged={setVal} />;
};
