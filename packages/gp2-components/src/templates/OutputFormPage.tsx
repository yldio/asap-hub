import { pixels } from '@asap-hub/react-components';
import { mainStyles } from '../layout';

import PageNotifications from './PageNotifications';

const { rem } = pixels;

const OutputFormPage: React.FC = ({ children }) => (
  <PageNotifications page="output-form">
    {(notification) => (
      <article
        css={notification ? { position: 'relative', marginTop: rem(48) } : {}}
      >
        <main css={mainStyles}>{children}</main>
      </article>
    )}
  </PageNotifications>
);
export default OutputFormPage;
