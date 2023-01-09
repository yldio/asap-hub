import { Link } from '@asap-hub/react-components';
import { ReactNode } from 'react';

export interface SocialLinkProps {
  readonly key?: string;
  readonly link?: string;
  readonly icon?: ReactNode;
  readonly displayName?: string;
}

const SocialLink = ({ link, icon, displayName }: SocialLinkProps) => (
  <div css={{ textTransform: 'capitalize' }}>
    <Link href={link} buttonStyle noMargin small>
      {icon}
      {displayName}
    </Link>
  </div>
);

export default SocialLink;
