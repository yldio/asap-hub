import { EmailSection } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms / Email Section',
  component: EmailSection,
};

const emails = [
  { email: 'pm@example.com', contact: 'PM Email' },
  { email: 'lead@example.com', contact: 'Lead Email' },
];

export const Normal = () => <EmailSection contactEmails={emails} />;
