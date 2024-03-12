import { boolean, text } from './knobs';

import { RichText } from '@asap-hub/react-components';

export default {
  title: 'Atoms / Rich Text',
  component: RichText,
};

export const Paragraph = () => <RichText text="<p>paragraph</p>" />;

export const Normal = () => (
  <RichText
    toc={boolean('ToC', true)}
    text={text(
      'Text',
      '<h1>Heading 1</h1><h1><b>Heading bold</b></h1><h1><i>Heading Italic</i></h1><p>Paragraph</p><h2>Heading 2</h2><p>Paragraph</p><h3>Heading 3</h3><p>Paragraph</p>',
    )}
  />
);
