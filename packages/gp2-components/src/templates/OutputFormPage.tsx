import { pixels, Toast } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { layoutContentStyles, mainStyles } from '../layout';

import PageNotifications from './PageNotifications';

const { rem } = pixels;

export type OutputFormPageProps = ComponentProps<React.FC> & {
  version?: boolean;
};

const OutputFormPage = ({ children, version = false }: OutputFormPageProps) => (
  <PageNotifications page="output-form">
    {(notification) => (
      <article
        css={notification ? { position: 'relative', marginTop: rem(48) } : {}}
      >
        {version}
        {version && (
          <Toast accent="warning">
            The previous output page will be replaced with a summarised version
            history section.
          </Toast>
        )}
        <div css={layoutContentStyles}>
          <main css={mainStyles}>{children}</main>
        </div>
      </article>
    )}
  </PageNotifications>
);
export default OutputFormPage;
