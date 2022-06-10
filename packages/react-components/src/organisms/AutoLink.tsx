import { ComponentProps } from 'react';
import { Interweave } from 'interweave';
import { UrlMatcher } from 'interweave-autolink';

import { Link } from '../atoms';

interface AutoLink {
  content: ComponentProps<typeof Interweave>['content'];
}
const AutoLink: React.FC<AutoLink> = ({ content }) => (
  <Interweave
    escapeHtml
    noWrap
    content={content}
    matchers={[
      new UrlMatcher('url', {}, ({ url }) => <Link href={url}>{url}</Link>),
    ]}
  />
);

export default AutoLink;
