import { ContactInfoModal } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / User Profile / Contact Info Modal',
  component: ContactInfoModal,
};

export const Normal = () => (
  <StaticRouter>
    <ContactInfoModal
      email="contact@example.com"
      fallbackEmail="me@example.com"
      backHref="/wrong"
    />
  </StaticRouter>
);
