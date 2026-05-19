import { TextEditor } from '@asap-hub/react-components';
import { useState } from 'react';

export default {
  title: 'Atoms / TextEditor',
};

export const Normal = () => <TextEditor onChange={console.log} value={''} />;

export const WithExistingLink = () => (
  <TextEditor
    onChange={console.log}
    value={'Visit our [documentation](https://example.com) for details.'}
  />
);

export const Interactive = () => {
  const [value, setValue] = useState(
    'Select some text and click the link icon in the toolbar to add a hyperlink. Try a URL like https://asap.science or a bare hostname like example.com.',
  );
  return (
    <>
      <TextEditor onChange={setValue} value={value} />
      <details style={{ marginTop: 16 }}>
        <summary>Markdown output</summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{value}</pre>
      </details>
    </>
  );
};

export const ReadOnlyMarkdown = () => (
  <TextEditor
    onChange={console.log}
    enabled={false}
    isMarkdown
    value={
      'Read-only render (this is how discussion messages display).\n\n' +
      'See the [ASAP Hub](https://asap.science) and email ' +
      '[support](mailto:support@example.com) for help. Links open in a new tab.'
    }
  />
);
