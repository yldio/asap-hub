import { ContentfulNewsText } from '@asap-hub/model';

import ContentfulRichText from './ContentfulRichText';
import SquidexRichText from './SquidexRichText';

type RichTextRenderer = {
  text: string | ContentfulNewsText;
};

const RichTextRenderer: React.FC<RichTextRenderer> = ({ text }) =>
  text && typeof text !== 'string' ? (
    <ContentfulRichText text={text} />
  ) : (
    <SquidexRichText text={text} />
  );
export default RichTextRenderer;
