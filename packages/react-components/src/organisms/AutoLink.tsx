import { ComponentProps } from 'react';
import { Interweave } from 'interweave';
import { UrlMatcher } from 'interweave-autolink';

import { Link } from '../atoms';

interface AutoLinkProps {
  content: ComponentProps<typeof Interweave>['content'];
}
const AutoLink: React.FC<AutoLinkProps> = ({ content }) => (
  <Interweave
    escapeHtml
    noWrap
    content={content}
    matchers={[
      new UrlMatcher('url', {}, ({ url }: { url: string }) => (
        <Link href={url}>{url}</Link>
      )),
    ]}
  />
);

export default AutoLink;
