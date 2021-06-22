import { ContactInfoModal } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';
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
      social={{
        website1: text('Website 1', 'http://example.com'),
        website2: text('Website 2', 'http://example.com'),
        orcid: text('Orcid', ''),
        github: text('Github', 'example'),
        linkedIn: text('Linked In', 'example'),
        googleScholar: text('Google Scholar', 'example'),
        researchGate: text('Research Gate', 'example'),
        researcherId: text('Researcher Id', 'example'),
        twitter: text('Twitter', 'example'),
      }}
    />
  </StaticRouter>
);
