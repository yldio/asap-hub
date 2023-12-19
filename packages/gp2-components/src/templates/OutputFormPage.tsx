import { pixels, Toast } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { layoutContentStyles, mainStyles } from '../layout';

import PageNotifications from './PageNotifications';

const { rem } = pixels;

export type OutputFormPageProps = ComponentProps<React.FC> & {
  message?: string;
};

const OutputFormPage = ({ children, message = '' }: OutputFormPageProps) => (
  <PageNotifications page="output-form">
    {(notification) => (
      <article
        css={notification ? { position: 'relative', marginTop: rem(48) } : {}}
      >
        {message && <Toast accent="warning">{message}</Toast>}
        <div css={layoutContentStyles}>
          <main css={mainStyles}>{children}</main>
        </div>
      </article>
    )}
  </PageNotifications>
);
export default OutputFormPage;
